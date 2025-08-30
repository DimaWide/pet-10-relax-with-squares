import React, { useState, useEffect, useRef } from 'react';
import './Pyramid.scss';

const Pyramid = () => {
    const [speedFactor, setSpeedFactor] = useState(1);
    const [baseColor, setBaseColor] = useState(200);
    const [contrast, setContrast] = useState(10);
    const [smoothness, setSmoothness] = useState(0.5);
    const [shadowSize, setShadowSize] = useState(10);
    const [shadowOpacity, setShadowOpacity] = useState(0.5);

    const angleRef = useRef(0);

    useEffect(() => {
        let startTime = performance.now();

        const animate = (time) => {
            const elapsed = (time - startTime) / 1000;
            const rotationSpeed = 60 * speedFactor;
            angleRef.current = (elapsed * rotationSpeed) % 360;

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [speedFactor]);

    useEffect(() => {
        const colorInterval = setInterval(() => {
            setBaseColor((prevColor) => (prevColor + 1) % 360);
        }, 50);
        return () => clearInterval(colorInterval);
    }, []);

    const squares = Array.from({ length: 10 }, (_, index) => {
        const contrastColor = (baseColor + index * contrast) % 360;
        return {
            sizePercentage: (index + 1) * 10,
            color: `hsl(${contrastColor}, 80%, 60%)`,
        };
    });

    useEffect(() => {
        const lastColor = squares[squares.length - 1].color;

        document.body.style.transition = `background-color ${smoothness}s ease-out`;
        document.body.style.backgroundColor = lastColor;

        return () => {
            document.body.style.backgroundColor = "";
        };
    }, [squares, smoothness]);


    return (
        <div className="pyramid-container-out">
            <div className="controls">
                <label>Base Color (Hue)</label>
                <input type="range" min="0" max="360" value={baseColor} onChange={(e) => setBaseColor(Number(e.target.value))} />

                <label>Contrast</label>
                <input type="range" min="0" max="50" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />

                <label>Smoothness</label>
                <input type="range" min="0" max="1" step="0.01" value={smoothness} onChange={(e) => setSmoothness(Number(e.target.value))} />

                <label>Speed Factor</label>
                <input type="range" min="0.1" max="5" step="0.1" value={speedFactor} onChange={(e) => setSpeedFactor(Number(e.target.value))} />

                <label>Shadow Size</label>
                <input type="range" min="0" max="50" value={shadowSize} onChange={(e) => setShadowSize(Number(e.target.value))} />

                <label>Shadow Opacity</label>
                <input type="range" min="0" max="1" step="0.05" value={shadowOpacity} onChange={(e) => setShadowOpacity(Number(e.target.value))} />
            </div>

            <div className="pyramid-container">
                {/* Ползунки */}

                {/* Анимация */}
                {squares.map((square, index) => {
                    const offsetX = Math.cos((angleRef.current + index * 36) * (Math.PI / 180)) * 150;
                    const offsetY = Math.sin((angleRef.current + index * 36) * (Math.PI / 180)) * 150;

                    return (
                        <div
                            key={index}
                            className="square"
                            style={{
                                width: `${square.sizePercentage}%`,
                                height: `${square.sizePercentage}%`,
                                backgroundColor: square.color,
                                position: 'absolute',
                                top: `50%`,
                                left: `50%`,
                                transform: `translate(-50%, -50%) translateX(${offsetX}px) translateY(${offsetY}px)`,
                                zIndex: squares.length - index,
                                transition: `transform ${smoothness}s ease-out, background-color ${smoothness}s ease-out`,
                                boxShadow: `0px ${shadowSize}px ${shadowSize * 2}px rgba(0, 0, 0, ${shadowOpacity})`, // Динамическая тень
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Pyramid;
