import React, { useState, useEffect } from 'react';
import './Pyramid.scss';

const Pyramid = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isActive, setIsActive] = useState(false);
    const [animationOffset, setAnimationOffset] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [baseColor, setBaseColor] = useState(200); // Основной цвет в HSL (тон)

    useEffect(() => {

        const handleMouseMove = (e) => {
            // Используем pageX и pageY вместо clientX и clientY
            const x = e.pageX - window.scrollX;
            const y = e.pageY - window.scrollY;
            setMousePos({ x, y });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        let direction = 1;
        const animate = () => {
            setRotation((prev) => prev + 0.1);
            requestAnimationFrame(animate);
        };
        animate();
    }, []);

    const squares = Array.from({ length: 10 }, (_, index) => ({
        sizePercentage: (index + 1) * 10,
        color: `hsl(${(baseColor + index * 15) % 360}, 80%, 60%)`,
        speedFactor: 10 + index * 5,
    }));


    return (
        <div className="pyramid-container" data-b1>
            <input
                type="range"
                min="0"
                max="360"
                value={baseColor}
                onChange={(e) => setBaseColor(Number(e.target.value))}
                style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 11 }}
            />
            {squares.map((square, index) => {
                const offsetX = (mousePos.x - window.innerWidth / 2) / (index === 0 ? square.speedFactor * 2 : square.speedFactor) + animationOffset;
                const offsetY = (mousePos.y - window.innerHeight / 2) / (index === 0 ? square.speedFactor * 2 : square.speedFactor) + animationOffset;

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
                            transform: `translate(-50%, -50%) translateX(${offsetX}px) translateY(${offsetY}px) `,
                            zIndex: squares.length - index,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Pyramid;
