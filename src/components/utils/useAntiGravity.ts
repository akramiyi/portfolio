import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export const useAntiGravity = () => {
    const isFloatingRef = useRef(false);

    useEffect(() => {
        // Only run after 2000ms inside the browser
        const timer = setTimeout(() => {
            if (isFloatingRef.current) return;
            isFloatingRef.current = true;
            
            // 1. Setup Matter.js Engine & World
            const Engine = Matter.Engine,
                Runner = Matter.Runner,
                Bodies = Matter.Bodies,
                Composite = Matter.Composite,
                Mouse = Matter.Mouse,
                MouseConstraint = Matter.MouseConstraint;

            const engine = Engine.create();
            engine.gravity.y = 0; // Zero gravity!
            engine.gravity.x = 0;

            const world = engine.world;
            const runner = Runner.create();

            // 2. Discover DOM elements to float
            const elementsToFloat = Array.from(
                document.querySelectorAll('h1, h2, h3, h4, h5, p, a, button, img, .career-info-box')
            ).filter(el => {
                // Ensure element has size & is visible
                const rect = (el as HTMLElement).getBoundingClientRect();
                return rect.width > 10 && rect.height > 10 && window.getComputedStyle(el).display !== 'none';
            }) as HTMLElement[];

            const bodiesAndElements: { body: Matter.Body; el: HTMLElement; initialX: number; initialY: number }[] = [];

            // 3. Build Physics Bodies & detach DOM
            elementsToFloat.forEach((el) => {
                const rect = el.getBoundingClientRect();
                
                // Absolute positions relative to the entire document
                const scrollX = window.scrollX || window.pageXOffset;
                const scrollY = window.scrollY || window.pageYOffset;
                const startX = rect.left + scrollX;
                const startY = rect.top + scrollY;

                // Center coordinates for Matter.js bodies
                const centerX = startX + rect.width / 2;
                const centerY = startY + rect.height / 2;

                // Store styles to revert safely if needed, then rip element out of normal flow
                el.style.position = 'absolute';
                el.style.left = `${startX}px`;
                el.style.top = `${startY}px`;
                el.style.margin = '0';
                el.style.zIndex = '999999';
                el.style.transformOrigin = 'center center'; // Ensure rotation happens around the center
                el.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.05)'; // Soft shadow and glow
                el.style.transition = 'box-shadow 0.5s ease-in-out';
                el.style.cursor = 'grab';

                // Create rectangle physics body
                const body = Bodies.rectangle(centerX, centerY, rect.width, rect.height, {
                    restitution: 0.9,    // Soft bounciness
                    frictionAir: 0.015,   // Low air resistance for continuous zero-g floating
                    friction: 0.1,
                    density: 0.005
                });

                // Apply a tiny random torque and velocity so they start floating effortlessly
                Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.03); // Slower 3D style rotation
                Matter.Body.setVelocity(body, {
                    x: (Math.random() - 0.5) * 3, // Smooth, slow drift
                    y: (Math.random() - 0.5) * 3
                });

                Composite.add(world, body);

                bodiesAndElements.push({
                    body,
                    el,
                    initialX: startX,
                    initialY: startY
                });
            });

            // 4. Create World Boundaries (Walls to keep elements on screen)
            const width = document.documentElement.scrollWidth;
            const height = document.documentElement.scrollHeight;
            const wallOptions = { isStatic: true, restitution: 0.8, friction: 0 }; // Bouncy walls
            
            Composite.add(world, [
                Bodies.rectangle(width / 2, -50, width * 2, 100, wallOptions), // Top
                Bodies.rectangle(width / 2, height + 50, width * 2, 100, wallOptions), // Bottom
                Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions), // Left
                Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions) // Right
            ]);

            // 5. Add Mouse Interaction (Drag elements)
            const mouse = Mouse.create(document.body);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.1, // Smooth dragging constraint
                    render: { visible: false }
                }
            });
            Composite.add(world, mouseConstraint);

            // Add grabbing cursors to mouse interaction
            Matter.Events.on(mouseConstraint, 'mousedown', () => {
                 document.body.style.cursor = 'grabbing';
            });
            Matter.Events.on(mouseConstraint, 'mouseup', () => {
                 document.body.style.cursor = 'default';
            });

            // Keep mouse in sync with scrolling
            // @ts-ignore - matter-js types are incomplete for mousewheel
            mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
            // @ts-ignore - matter-js types are incomplete for DOMMouseScroll
            mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

            // 6. Start Physics Engine
            Runner.run(runner, engine);

            // 7. Render Loop (Sync Physics -> DOM)
            let animationFrameId: number;
            const updateDOM = () => {
                bodiesAndElements.forEach(({ body, el, initialX, initialY }) => {
                    // Calculate Delta from original position
                    const dx = body.position.x - (initialX + el.offsetWidth / 2);
                    const dy = body.position.y - (initialY + el.offsetHeight / 2);
                    const angle = body.angle;

                    // Apply the GPU accelerated transform
                    // Adding a slight hardware-accelerated 3D scale based on velocity to simulate depth
                    const depthScale = 1 + (Math.abs(body.velocity.x) + Math.abs(body.velocity.y)) * 0.005;

                    el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${depthScale}) rotate(${angle}rad)`;
                });
                
                animationFrameId = requestAnimationFrame(updateDOM);
            };

            animationFrameId = requestAnimationFrame(updateDOM);

            // Optional cleanup mechanism if component unmounts
            return () => {
                cancelAnimationFrame(animationFrameId);
                Runner.stop(runner);
                Engine.clear(engine);
            };

        }, 2000); // Wait 2 seconds before ripping the DOM apart

        return () => clearTimeout(timer);
    }, []);
};

