import Matter from 'matter-js'

let engine, render, runner;
let overlayCtx, overlayCanvasEl;
let currentParams = {};
let trackedBodies = [];
let currentCategory = '';
let currentSubModel = '';

// 保存传送带的状态
let beltVelocity = 0;

export function initEngine(containerEl, overlayEl, initialParams) {
  currentParams = { ...initialParams };
  currentCategory = currentParams.category;
  currentSubModel = currentParams.subModel;

  overlayCanvasEl = overlayEl;
  overlayCtx = overlayEl.getContext('2d');

  const width = containerEl.clientWidth;
  const height = containerEl.clientHeight;
  overlayEl.width = width;
  overlayEl.height = height;

  window.addEventListener('resize', handleResize);

  engine = Matter.Engine.create();

  render = Matter.Render.create({
    element: containerEl,
    engine: engine,
    options: {
      width,
      height,
      wireframes: false,
      background: 'transparent',
      pixelRatio: window.devicePixelRatio
    }
  });

  runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  Matter.Render.run(render);

  Matter.Events.on(render, 'afterRender', drawOverlay);
  Matter.Events.on(engine, 'beforeUpdate', beforeUpdateLogic);

  loadModel();
}

export function destroyEngine() {
  if (render) {
    Matter.Render.stop(render);
    render.canvas.remove();
  }
  if (runner) Matter.Runner.stop(runner);
  if (engine) Matter.Engine.clear(engine);
  window.removeEventListener('resize', handleResize);
}

export function switchModel(params) {
  currentParams = { ...params };
  currentCategory = params.category;
  currentSubModel = params.subModel;
  loadModel();
}

export function updateParams(params) {
  currentParams = { ...params };
}

function handleResize() {
  if (!render || !overlayCanvasEl) return;
  const container = render.element;
  const width = container.clientWidth;
  const height = container.clientHeight;

  render.canvas.width = width;
  render.canvas.height = height;
  render.options.width = width;
  render.options.height = height;

  overlayCanvasEl.width = width;
  overlayCanvasEl.height = height;
}

function loadModel() {
  Matter.World.clear(engine.world);
  Matter.Engine.clear(engine);
  trackedBodies = [];
  beltVelocity = currentParams.conveyorV || 0;

  const width = render.options.width;
  const height = render.options.height;

  if (currentCategory === 'basic') {
    setupInclineModel(width, height);
  } else if (currentCategory === 'connected') {
    if (currentSubModel === 'rope') setupPulleyModel(width, height);
    else if (currentSubModel === 'rod') setupRodModel(width, height);
    else if (currentSubModel === 'stacked') setupStackedModel(width, height);
    else if (currentSubModel === 'sideBySide') setupSideBySideModel(width, height);
  } else if (currentCategory === 'conveyor') {
    setupConveyorModel(width, height, currentSubModel);
  } else if (currentCategory === 'em') {
    setupElectromagneticModel(width, height);
  }
}
function setupInclineModel(width, height) {
  engine.world.gravity.y = 1;
  const angleRad = currentParams.angle * Math.PI / 180;
  const ground = createGround(width, height);
  const inclineLength = width * 0.6;
  const inclineX = width / 2;
  const inclineY = height - 100;

  // 创建斜面并添加 customData
  const incline = Matter.Bodies.rectangle(inclineX, inclineY, inclineLength, 20, {
    isStatic: true,
    angle: -angleRad,
    friction: currentParams.mu,
    render: { fillStyle: '#475569' }
  });
  incline.customData = { id: 'incline', type: 'incline_plane', angleRad }; // 新增
  trackedBodies.push(incline); // 新增

  const block = Matter.Bodies.rectangle(inclineX, inclineY - inclineLength * 0.3 * Math.sin(angleRad) - 50, 60, 60, {
    mass: currentParams.massA,
    friction: currentParams.mu,
    frictionAir: 0,
    render: { fillStyle: '#10b981' }
  });
  block.customData = { id: 'A', type: 'block_on_incline', angleRad };
  trackedBodies.push(block);

  Matter.World.add(engine.world, [ground, incline, block]);
}

function createGround(width, height) {
  return Matter.Bodies.rectangle(width / 2, height - 20, width, 40, { isStatic: true, render: { fillStyle: '#334155' } });
}



function setupPulleyModel(width, height) {
  engine.world.gravity.y = 1;
  const ground = createGround(width, height);

  const pulleyX = width / 2;
  const pulleyY = 150;
  const pulley = Matter.Bodies.circle(pulleyX, pulleyY, 30, { isStatic: true, render: { fillStyle: '#cbd5e1' } });

  const boxA = Matter.Bodies.rectangle(pulleyX - 30, pulleyY + 100, 50, 50, { mass: currentParams.massA, frictionAir: 0, render: { fillStyle: '#ef4444' } });
  const boxB = Matter.Bodies.rectangle(pulleyX + 30, pulleyY + 150, 60, 60, { mass: currentParams.massB, frictionAir: 0, render: { fillStyle: '#3b82f6' } });

  boxA.customData = { id: 'A', type: 'hanging_box' };
  boxB.customData = { id: 'B', type: 'hanging_box' };

  const balanceBar = Matter.Bodies.rectangle(pulleyX, pulleyY, 60, 10, { isStatic: false, mass: 0.1 });
  const centerConstraint = Matter.Constraint.create({ bodyA: balanceBar, pointB: { x: pulleyX, y: pulleyY }, stiffness: 1, length: 0 });

  const rope1 = Matter.Constraint.create({ bodyA: balanceBar, pointA: { x: -30, y: 0 }, bodyB: boxA, pointB: { x: 0, y: -25 }, stiffness: 1, length: 150 });
  const rope2 = Matter.Constraint.create({ bodyA: balanceBar, pointA: { x: 30, y: 0 }, bodyB: boxB, pointB: { x: 0, y: -30 }, stiffness: 1, length: 150 });

  trackedBodies.push(boxA, boxB);
  Matter.World.add(engine.world, [ground, pulley, balanceBar, centerConstraint, boxA, boxB, rope1, rope2]);
}

function setupRodModel(width, height) {
  engine.world.gravity.y = 1;
  const ground = createGround(width, height);
  const startY = height - 70;
  const boxA = Matter.Bodies.rectangle(width / 2 - 100, startY, 60, 60, { mass: currentParams.massA, friction: currentParams.mu, render: { fillStyle: '#ef4444' } });
  const boxB = Matter.Bodies.rectangle(width / 2 + 100, startY, 60, 60, { mass: currentParams.massB, friction: currentParams.mu, render: { fillStyle: '#3b82f6' } });

  boxA.customData = { id: 'A', type: 'rod_connected', partner: boxB };
  boxB.customData = { id: 'B', type: 'rod_connected', partner: boxA };

  const rod = Matter.Constraint.create({
    bodyA: boxA, bodyB: boxB, stiffness: 1, length: 200, render: { strokeStyle: '#fff', lineWidth: 4 }
  });

  trackedBodies.push(boxA, boxB);
  Matter.World.add(engine.world, [ground, boxA, boxB, rod]);
}

function setupStackedModel(width, height) {
  engine.world.gravity.y = 1;
  const ground = createGround(width, height);
  const startY = height - 70;

  const boxA = Matter.Bodies.rectangle(width / 2, startY, 200, 40, { mass: currentParams.massA, friction: currentParams.mu, render: { fillStyle: '#ef4444' } });
  const boxB = Matter.Bodies.rectangle(width / 2, startY - 50, 60, 60, { mass: currentParams.massB, friction: currentParams.muAB, render: { fillStyle: '#3b82f6' } });

  boxA.customData = { id: 'A', type: 'stacked_bottom' };
  boxB.customData = { id: 'B', type: 'stacked_top', partner: boxA };

  trackedBodies.push(boxA, boxB);
  Matter.World.add(engine.world, [ground, boxA, boxB]);
}

function setupSideBySideModel(width, height) {
  engine.world.gravity.y = 1;
  const ground = createGround(width, height);
  const startY = height - 70;

  const boxA = Matter.Bodies.rectangle(width / 2 - 30, startY, 60, 60, { mass: currentParams.massA, friction: currentParams.mu, render: { fillStyle: '#ef4444' } });
  const boxB = Matter.Bodies.rectangle(width / 2 + 30, startY, 60, 60, { mass: currentParams.massB, friction: currentParams.mu, render: { fillStyle: '#3b82f6' } });

  boxA.customData = { id: 'A', type: 'side_by_side', side: 'left', partner: boxB };
  boxB.customData = { id: 'B', type: 'side_by_side', side: 'right', partner: boxA };

  trackedBodies.push(boxA, boxB);
  Matter.World.add(engine.world, [ground, boxA, boxB]);
}

function setupConveyorModel(width, height, type) {
  engine.world.gravity.y = 1;
  const angleRad = type === 'inclined' ? currentParams.angle * Math.PI / 180 : 0;

  const conveyor = Matter.Bodies.rectangle(width / 2, height - 100, width * 0.8, 40, {
    isStatic: true, angle: -angleRad, friction: 0,
    render: { fillStyle: '#64748b' }
  });

  const blockX = width / 2;
  const blockY = height - 100 - 60;
  const block = Matter.Bodies.rectangle(blockX, blockY, 60, 60, {
    mass: currentParams.massA, friction: 0, render: { fillStyle: '#10b981' }
  });

  Matter.Body.setVelocity(block, { x: currentParams.v0_A * Math.cos(-angleRad), y: currentParams.v0_A * Math.sin(-angleRad) });

  block.customData = { id: 'A', type: 'conveyor_block', angleRad };
  trackedBodies.push(block);
  Matter.World.add(engine.world, [conveyor, block]);
}

function setupElectromagneticModel(width, height) {
  engine.world.gravity.y = 0;
  const particle = Matter.Bodies.circle(width / 2, height / 2, 20, {
    mass: currentParams.massA, frictionAir: 0, restitution: 1,
    render: { fillStyle: currentParams.charge > 0 ? '#ef4444' : (currentParams.charge < 0 ? '#3b82f6' : '#94a3b8') }
  });
  Matter.Body.setVelocity(particle, { x: 2, y: 0 });
  particle.customData = { id: 'A', type: 'particle' };

  trackedBodies.push(particle);
  Matter.World.add(engine.world, particle);
}

function beforeUpdateLogic() {
  if (currentCategory === 'connected' && currentParams.pushForce !== 0) {
    const f = currentParams.pushForce * 0.001;
    trackedBodies.forEach(b => {
      if (b.customData.id === 'A') {
        Matter.Body.applyForce(b, b.position, { x: f, y: 0 });
      }
    });
  }

  if (currentCategory === 'conveyor') {
    beltVelocity += currentParams.conveyorA * 0.016;
    const v_belt = beltVelocity;
    const mu = currentParams.mu;
    const g = 1;

    trackedBodies.forEach(b => {
      if (b.customData.type === 'conveyor_block') {
        const angleRad = b.customData.angleRad;
        const v_block_x = b.velocity.x;
        const v_parallel = v_block_x * Math.cos(angleRad) - b.velocity.y * Math.sin(angleRad);
        const rel_v = v_parallel - v_belt;

        const N = b.mass * g * Math.cos(angleRad);

        if (Math.abs(rel_v) > 0.05) {
          const f_mag = mu * N * (rel_v > 0 ? -1 : 1);
          const fx = f_mag * Math.cos(angleRad) * 0.001;
          const fy = -f_mag * Math.sin(angleRad) * 0.001;
          Matter.Body.applyForce(b, b.position, { x: fx, y: fy });
          b.customData.f_mag = f_mag;
        } else {
          Matter.Body.setVelocity(b, {
            x: v_belt * Math.cos(-angleRad),
            y: v_belt * Math.sin(-angleRad)
          });
          b.customData.f_mag = b.mass * currentParams.conveyorA;
          if (angleRad !== 0) {
            b.customData.f_mag += b.mass * g * Math.sin(angleRad);
          }
        }
      }
    });
  }

  if (currentCategory === 'em') {
    const q = currentParams.charge;
    const E = currentParams.electricField;
    const B = currentParams.magneticField;

    trackedBodies.forEach(body => {
      if (body.customData && body.customData.type === 'particle') {
        const feY = q * E * 0.001;
        const v = body.velocity;
        const fmX = q * v.y * B * 0.0005;
        const fmY = -q * v.x * B * 0.0005;

        Matter.Body.applyForce(body, body.position, {
          x: fmX,
          y: feY + fmY
        });
      }
    });
  }
}

function drawOverlay() {
  if (!overlayCtx || !overlayCanvasEl) return;
  const ctx = overlayCtx;
  const width = overlayCanvasEl.width;
  const height = overlayCanvasEl.height;

  ctx.clearRect(0, 0, width, height);

  const target = currentParams.targetObject;

  if (currentCategory === 'conveyor') {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '16px "Inter"';
    ctx.fillText(`传送带速度 V: ${beltVelocity.toFixed(2)}`, 20, 30);
  }

  let centerOfMass = { x: 0, y: 0 };
  let totalMass = 0;

  if (target === 'ALL' && currentCategory === 'connected') {
    trackedBodies.forEach(b => {
      centerOfMass.x += b.position.x * b.mass;
      centerOfMass.y += b.position.y * b.mass;
      totalMass += b.mass;
    });
    centerOfMass.x /= totalMass;
    centerOfMass.y /= totalMass;

    drawVector(ctx, centerOfMass.x, centerOfMass.y, 0, totalMass * 1.5, '#ef4444', 'G_total');

    if (currentParams.pushForce > 0) {
      drawVector(ctx, centerOfMass.x - 50, centerOfMass.y, currentParams.pushForce * 0.5, 0, '#eab308', 'F_push');
    }
    drawVector(ctx, centerOfMass.x, centerOfMass.y + 30, 0, -totalMass * 1.5, '#3b82f6', 'N_total');
    return;
  }

  trackedBodies.forEach(body => {
    const data = body.customData;
    if (!data) return;

    if (currentCategory === 'connected') {
      if (target !== 'ALL' && data.id !== target) return;
    } else if (currentCategory === 'basic') {
      const mappedTarget = target === 'block' ? 'A' : (target === 'incline' ? 'incline' : 'ALL');
      if (mappedTarget !== 'ALL' && data.id !== mappedTarget) return;
    }

    const { x, y } = body.position;
    const mass = body.mass;

    if (data.type === 'block_on_incline') {
      const gScale = 2.5;
      const angleRad = data.angleRad;
      drawVector(ctx, x, y, 0, mass * gScale, '#ef4444', 'G');
      const nMagnitude = mass * Math.cos(angleRad) * gScale;
      drawVector(ctx, x, y, nMagnitude * Math.sin(angleRad), -nMagnitude * Math.cos(angleRad), '#3b82f6', 'N');

      const vParallel = body.velocity.x * Math.cos(angleRad) + body.velocity.y * Math.sin(angleRad);
      let fDirection = 1;
      if (vParallel > 0.1) fDirection = -1;
      const fMagnitude = currentParams.mu * nMagnitude * fDirection;
      if (Math.abs(fMagnitude) > 0.1) {
        drawVector(ctx, x, y, -fMagnitude * Math.cos(angleRad), -fMagnitude * Math.sin(angleRad), '#f59e0b', 'f');
      }
    }
    else if (data.type === 'incline_plane') {
      const gScale = 2.5;
      const angleRad = data.angleRad;
      const inclineMass = 10; // 斜面假设质量

      // 重力 (竖直向下)
      drawVector(ctx, x, y, 0, inclineMass * gScale, '#ef4444', 'G_incline');

      // 地面支持力 (竖直向上)
      drawVector(ctx, x, y + 40, 0, -inclineMass * gScale, '#3b82f6', 'N_ground');

      // 滑块压力 (垂直斜面向下)
      const blockNormal = currentParams.massA * Math.cos(angleRad) * gScale;
      drawVector(ctx, x, y, -blockNormal * Math.sin(angleRad), blockNormal * Math.cos(angleRad), '#f59e0b', 'N_block');

      // 滑块摩擦力 (沿斜面方向)
      const blockFriction = currentParams.mu * blockNormal;
      drawVector(ctx, x, y, blockFriction * Math.cos(angleRad), -blockFriction * Math.sin(angleRad), '#22c55e', 'f_block');
    }
    else if (data.type === 'hanging_box') {
      drawVector(ctx, x, y, 0, mass * 1.5, '#ef4444', 'G');
      drawVector(ctx, x, y - 25, 0, -mass * 1.2, '#10b981', 'T');
    }
    else if (data.type === 'rod_connected') {
      drawVector(ctx, x, y, 0, mass * 1.5, '#ef4444', 'G');
      drawVector(ctx, x, y + 30, 0, -mass * 1.5, '#3b82f6', 'N');
      const tension = (data.partner.mass - mass) * 0.5;
      drawVector(ctx, x + (data.id === 'A' ? 30 : -30), y, tension, 0, '#10b981', 'F_rod');
      if (data.id === 'A' && currentParams.pushForce > 0) {
        drawVector(ctx, x - 30, y, currentParams.pushForce * 0.5, 0, '#eab308', 'F_push');
      }
    }
    else if (data.type === 'side_by_side') {
      drawVector(ctx, x, y, 0, mass * 1.5, '#ef4444', 'G');
      drawVector(ctx, x, y + 30, 0, -mass * 1.5, '#3b82f6', 'N');
      if (data.id === 'A' && currentParams.pushForce > 0) {
        drawVector(ctx, x - 30, y, currentParams.pushForce * 0.5, 0, '#eab308', 'F_push');
      }
      drawVector(ctx, x + (data.side === 'left' ? 30 : -30), y, data.side === 'left' ? -10 : 10, 0, '#10b981', 'N_AB');
    }
    else if (data.type === 'stacked_bottom' || data.type === 'stacked_top') {
      drawVector(ctx, x, y, 0, mass * 1.5, '#ef4444', 'G');
      if (data.type === 'stacked_bottom') {
        drawVector(ctx, x, y + 20, 0, -(mass + currentParams.massB) * 1.5, '#3b82f6', 'N_total');
        if (currentParams.pushForce > 0) {
          drawVector(ctx, x - 100, y, currentParams.pushForce * 0.5, 0, '#eab308', 'F_push');
        }
        drawVector(ctx, x, y - 20, -10, 0, '#f59e0b', 'f_BA');
      } else {
        drawVector(ctx, x, y + 30, 0, -mass * 1.5, '#3b82f6', 'N_AB');
        drawVector(ctx, x, y + 30, 10, 0, '#f59e0b', 'f_AB');
      }
    }
    else if (data.type === 'conveyor_block') {
      const gScale = 2.0;
      const angleRad = data.angleRad;
      drawVector(ctx, x, y, 0, mass * gScale, '#ef4444', 'G');
      const nMagnitude = mass * Math.cos(angleRad) * gScale;
      drawVector(ctx, x, y, nMagnitude * Math.sin(angleRad), -nMagnitude * Math.cos(angleRad), '#3b82f6', 'N');

      const f_mag = data.f_mag || 0;
      if (Math.abs(f_mag) > 0.1) {
        drawVector(ctx, x, y, f_mag * Math.cos(angleRad) * 2, -f_mag * Math.sin(angleRad) * 2, '#f59e0b', 'f');
      }
    }
    else if (data.type === 'particle') {
      drawVector(ctx, x, y, body.velocity.x * 10, body.velocity.y * 10, '#f59e0b', 'v');
      const q = currentParams.charge;
      if (q !== 0) {
        if (currentParams.electricField !== 0) drawVector(ctx, x, y, 0, q * currentParams.electricField * 15, '#ef4444', 'Fe');
        if (currentParams.magneticField !== 0) {
          const fmX = q * body.velocity.y * currentParams.magneticField * 10;
          const fmY = -q * body.velocity.x * currentParams.magneticField * 10;
          if (Math.abs(fmX) > 0.1 || Math.abs(fmY) > 0.1) drawVector(ctx, x, y, fmX, fmY, '#3b82f6', 'Fm');
        }
      }
    }
  });
}

function drawVector(ctx, x, y, dx, dy, color, label) {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1) return;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  const angle = Math.atan2(dy, dx);
  const headlen = 10;
  ctx.beginPath();
  ctx.moveTo(x + dx, y + dy);
  ctx.lineTo(x + dx - headlen * Math.cos(angle - Math.PI / 6), y + dy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x + dx - headlen * Math.cos(angle + Math.PI / 6), y + dy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(x + dx, y + dy);
  ctx.fillStyle = color;
  ctx.fill();

  if (label) {
    ctx.fillStyle = color;
    ctx.font = '14px "Inter"';
    ctx.fillText(label, x + dx + 5, y + dy + 5);
  }
}
