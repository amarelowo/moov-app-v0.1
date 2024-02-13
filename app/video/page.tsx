"use client"
import React, { useEffect } from 'react';

const VideoPage = () => {

    useEffect(() => {
        
        const handleMouseMove = () => {
            window.electron.activityDetection()
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }


    }, [])
   

    return (
        <div className="flex justify-center items-center h-screen w-screen overflow-hidden">
            <video
                className="transform rotate-90 w-full max-w-none"
                style={{ width: "100vh", height: "100vw" }} // Definir a altura para a largura da viewport e vice-versa
                loop
                autoPlay
                muted // Adicionado muted para garantir que autoplay funcione na maioria dos navegadores
            >
                <source src="/video/propaganda.mp4" type="video/mp4" />
                Seu navegador não suporta vídeos.
            </video>
        </div>
    );
};

export default VideoPage;