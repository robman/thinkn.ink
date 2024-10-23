// see https://github.com/robman/thinkn.ink for more details
// NOTE: this code is only a prototype designed to make a useful app for personal use 8)

// add your api key here - but this is only for personal use/prototyping
// do NOT use this in a public web server - you should use a proxy to inject this into requests instead
let api_key = "ADD-YOUR-OPENAI-API-TOKEN-HERE";

window.onload = async () => {
  Object.keys(ui_state_ids).forEach((id) => {
    ui_states[id] = document.getElementById(id);
  });

  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('touchstart', (event) => {
      event.stopPropagation();
      event.preventDefault();
      button_tap(event.target.id);
    });
  });

  show_ui('app'); 

  await toggle_hamburger();
}

let ui_state_ids = {"loading":1,"app":1,"error":1},
    ui_states = {};
function show_ui(state) {
  if (ui_states[state] !== undefined) {
    Object.keys(ui_states).forEach((id) => {
      ui_states[id].classList.add('hidden');
    });
    ui_states[state].classList.remove('hidden');
  }
}

let hamburger = document.getElementById('hamburger'),
    close = document.getElementById('close'),
    menu1 = document.getElementById('menu1'),
    menu2 = document.getElementById('menu2'),
    pen = document.getElementById('pen'),
    clear = document.getElementById('clear'),
    hamburger_open = false,
    button_size = getComputedStyle(document.body).getPropertyValue('--button-size'),
    dpr = window.devicePixelRatio,
    longest_side = Math.floor(4096/dpr), // TODO move to using https://jhildenbiddle.github.io/canvas-size/#/ or similar
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    crop_canvas = document.getElementById('crop_canvas'),
    crop_ctx = crop_canvas.getContext('2d'),
    undo_list = [],
    undo_id = -1,
    mm = { min:{ x:1000000, y:1000000 }, max:{ x:-1000000, y:-1000000 } },
    processing = document.getElementById('processing'),
    spinner = document.getElementById('spinner'),
    draw_mode = 'pen',
    window_mode = 'draw',
    scale = 1,
    translate_x = 0,
    translate_y = 0,
    last_touch_x, last_touch_y, moving = false,
    last_touch, new_touch,
    initial_pinch_distance = null,
    initial_scale = scale;

canvas.style.width = `${longest_side}px`;
canvas.style.height = `${longest_side}px`;
canvas.width = longest_side * dpr;
canvas.height = longest_side * dpr;
ctx.scale(dpr, dpr);

function client_to_canvas(client_x, client_y) {
  const rect = canvas.getBoundingClientRect();
  const x = (client_x - rect.left) / scale;
  const y = (client_y - rect.top) / scale;
  return { x, y };
}

window.addEventListener('touchstart', (event) => {
  if (window_mode != 'draw') { return; }
  if (event.touches.length === 1) {
    last_touch = client_to_canvas(event.touches[0].clientX, event.touches[0].clientY);
    ctx.beginPath();
  }
  if (event.touches.length === 2) {
    moving = true;
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    last_touch_x = (touch1.clientX+touch2.clientX)/2;
    last_touch_y = (touch1.clientY+touch2.clientY)/2;
  }
});

window.addEventListener('touchmove', (event) => {
  if (window_mode != 'draw') { return; }

  if (event.touches.length === 1) {
    let new_touch = client_to_canvas(event.touches[0].clientX, event.touches[0].clientY);
    if (last_touch && !moving) {
      ctx.moveTo(last_touch.x, last_touch.y);
      ctx.lineTo(new_touch.x, new_touch.y);
      ctx.stroke();
      update_mm(new_touch.x, new_touch.y);
    }
    last_touch = new_touch;
  }

  if (event.touches.length === 2) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];

    // two finger pan
    let new_touch_x = (touch1.clientX+touch2.clientX)/2;
    let new_touch_y = (touch1.clientY+touch2.clientY)/2;
    const delta_x = (new_touch_x - last_touch_x) / scale;
    const delta_y = (new_touch_y - last_touch_y) / scale;
    translate_x += delta_x;
    translate_y += delta_y;
    last_touch_x = new_touch_x;
    last_touch_y = new_touch_y;

    // two finger pinch/zoom
    const touch_distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
    if (!initial_pinch_distance) {
      initial_pinch_distance = touch_distance;
      initial_scale = scale;
    } else {
      scale = initial_scale * (touch_distance / initial_pinch_distance);
    }

    canvas.style.transform = `scale(${scale}) translate(${translate_x}px, ${translate_y}px)`;
  }
});

window.addEventListener('touchend', (event) => {
  if (window_mode != 'draw') { return; }
  last_touch = undefined;
  if (event.touches.length < 2) {
    initial_pinch_distance = null;
    initial_scale = scale;
    if (event.touches.length == 0) {
      if (moving) {
        moving = false;
      } else {
        if (draw_mode != 'undo') {
          undo_id++;
          if (undo_list[undo_id]) {
            delete undo_list[undo_id];
          }
          undo_list[undo_id] = ctx.getImageData(0,0,canvas.width,canvas.height);
          if (undo_list.length > 10 || undo_id > 10) { // to prevent memory issues - TODO move 10 to config
            delete undo_list[0];
            undo_list.shift();
            undo_id--;
          }
          if (undo_id > -1) {
            document.getElementById('undo').style.opacity = 1;
          }
          ctx.closePath();
        }
      }
    }
  }
});

// TODO this is a bit convoluted - move to a clean canvas class
function button_tap(id) {
  if (id != undo && undo_id > -1) {
    document.querySelectorAll('.button_box').forEach((el) => { el.classList.remove('selected'); });
    document.getElementById(id).parentElement.classList.add('selected');
  }
  if (id == 'hamburger') {
    toggle_hamburger();
  } else if (id == 'close') {
    toggle_hamburger();
  } else if (id == 'pen') {
    set_draw_mode('pen');
    //toggle_hamburger();
  } else if (id == 'eraser') {
    set_draw_mode('eraser');
  } else if (id == 'clear') {
    set_draw_mode('clear');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    mm = { min:{ x:1000000, y:1000000 }, max:{ x:-1000000, y:-1000000 } };
    setTimeout(() => {
      set_draw_mode('pen');
      undo_id = -1;
      undo_list = [];
      document.getElementById('undo').style.opacity = 0.25;
    }, 500);
  } else if (id == 'undo') {
    set_draw_mode('undo');
    if (undo_id > -1) {
      undo();
    }
  } else if (id == 'submit') {
    window_mode = 'response';
    setTimeout(() => {
      spinner.classList.add('spinning');
      processing.style.display = 'flex';
      let ci = get_cropped_image();
      openai_request(ci.image);
    }, 500);
  }
}

function set_draw_mode(mode = 'pen', colour = 'blue') {
  draw_mode = mode;
  if (draw_mode == 'pen') {
    ctx.lineWidth = 2;
    ctx.strokeStyle = colour
    ctx.globalCompositeOperation = "source-over"
  } else if (draw_mode == 'eraser') {
    ctx.lineWidth = 20;
    ctx.globalCompositeOperation = "destination-out"
  } else if (draw_mode == 'undo') {
    setTimeout(() => {
      set_draw_mode('pen');
      if (undo_id == -1) {
        document.getElementById('undo').style.opacity = 0.25;
      }
    }, 500);
  } else {
    return;
  }
  document.querySelectorAll('.button_box').forEach((el) => { el.classList.remove('selected'); });
  document.getElementById(draw_mode).parentElement.classList.add('selected');
}

function undo() {
  if (undo_id > -1) {
    if (undo_list[undo_id]) {
      delete undo_list[undo_id];
    }
    undo_id--;
    if (undo_list[undo_id]) {
      ctx.putImageData(undo_list[undo_id], 0, 0);
    } else {
      ctx.clearRect(0,0,canvas.width,canvas.height);
    }
  } else {
    return;
  }
}

function update_mm(x, y) {
  if (x < mm.min.x) { mm.min.x = x; }
  if (y < mm.min.y) { mm.min.y = y; }
  if (x > mm.max.x) { mm.max.x = x; }
  if (y > mm.max.y) { mm.max.y = y; }
}

// TODO move 512 to config
function get_crop_size() {
  let crop_w = mm.max.x-mm.min.x;
  let crop_h = mm.max.y-mm.min.y;
  let aspect = crop_w / crop_h;
  if (crop_w > crop_h) {
    if (crop_w > 512) {
      crop_w = 512;
      crop_h = crop_w / aspect;
    }
  } else if (crop_w < crop_h) {
    if (crop_h > 512) {
      crop_h = 512;
      crop_w = crop_h * aspect;
    }
  } else {
    if (crop_w > 512) {
      crop_w = 512;
      crop_h = 512;
    }
  }
  return { w:crop_w, h:crop_h, full_w:mm.max.x-mm.min.x, full_h:mm.max.y-mm.min.y };
}

function get_cropped_image() {
  let crop = get_crop_size();
  crop_canvas.width = crop.w * dpr;
  crop_canvas.height = crop.h * dpr;
  crop_canvas.style.width = `${crop.w}px`;
  crop_canvas.style.height = `${crop.h}px`;
  crop_ctx.scale(dpr, dpr);
  crop_ctx.drawImage(canvas, mm.min.x*dpr, mm.min.y*dpr, crop.full_w*dpr, crop.full_h*dpr, 0, 0, crop.w, crop.h);
  let img = crop_canvas.toDataURL('image/png', 1.0);
  return {
    image:img,
    width:crop.w,
    height:crop.h
  };
}

async function openai_request(base64) {
  // NOTE: this should cost < 1c per request/response - ymmv
  let io = {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are a friendly math tutor and you are helping this student work through a math problem they have sketched out in the current image. Work through the problem yourself before you decide if their solution is correct. Then provide step by step feedback. Also provide feedback on the clarity of their diagram or equation to help them improve their visual thinking. Format all your responses using structured HTML tags and include MathML where relevant. For example: '<h2>feedback heading goes here</h2><p>feedback sentence goes here</p>, valid HTML symbols e.g. &deg; not ^circ, and valid MathML markup using elements like mrow, etc. where relevant e.g. <math><mrow><mi>θ</mi><mo>=</mo><mn>180</mn><mo>°</mo></mrow></math> or <p>1. Solve for <math><mi>x</mi></math>:</p>" // see the README.md for more discussion on prompt engineering 
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Is this math correct?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": base64
            }
          }
        ]
      }
    ],
  };

  let headers = new Headers({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${api_key}`
  });
  let options = {
    method: 'POST',
    body: JSON.stringify(io),
    headers: headers,
  };
  let request = new Request("https://api.openai.com/v1/chat/completions", options);
  let response = await fetch(request);
  let completion = await response.json();
  let message = completion.choices[0].message.content;

  // TODO - this post-processing should not really be required if OpenAI API is returning nice responses
  message = message.replaceAll('```html', '');
  message = message.replaceAll('```', '');
  message = message.replaceAll('\\', '');
  message = message.replaceAll('\(', '');
  message = message.replaceAll('\)', '');

  let rs = document.querySelector('#response > span');
  rs.innerHTML = message;

  let r = document.getElementById('response');
  r.style.display = 'block';

  let rc = document.getElementById('response_close');
  rc.style.display = 'flex';
  rc.ontouchstart = (e) => {
    e.preventDefault();
    r.style.display = 'none';
    window_mode = 'draw';
    button_tap('pen');
  };

  processing.style.display = 'none';
  spinner.classList.remove('spinning');
}

function wait(n=1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve(); }, n);
  });
}

async function toggle_hamburger(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  if (hamburger_open) {
    menu1.animate(
      [ 
        { right:`-${5*button_size}vmin` },
        { right:"2cqmin" },
      ],
      {
        duration:300,
        iterations:1
      }
    );
    menu2.animate(
      [
        { top:"2cqmin" },
        { top:`-${9*button_size}vmin` },
      ],
      {
        duration:300,
        iterations:1
      }
    );
    await wait(290);
    menu1.style.right = "2cqmin";
    menu2.style.top = `-${9*button_size}vmin`; 
  } else {
    menu1.animate(
      [
        { right:"2cqmin" },
        { right:`-${5*button_size}vmin` },
      ],
      {
        duration:300,
        iterations:1
      }
    );
    menu2.animate(
      [
        { top:`-${9*button_size}vmin` },
        { top:"2cqmin" },
      ],
      {
        duration:300,
        iterations:1
      }
    );
    await wait(290);
    menu1.style.right = `-${5*button_size}vmin`;
    menu2.style.top = "2cqmin";
  }
  hamburger_open = !hamburger_open;
  if (draw_mode == 'pen') {
    set_draw_mode('pen');
  }
}
