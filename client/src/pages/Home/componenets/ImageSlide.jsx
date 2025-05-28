import useGet from "../../../hooks/useGet"
import { useState, useEffect } from "react";
export default function ImageSlide(){
    const [index, setIndex] = useState(0);
    const {data: images, isLoading} = useGet("http://localhost:1231/image")
    useEffect(() => {
        if(images){
            const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 8000); // 3 seconds

        return () => clearInterval(interval); // cleanup
        }
    }, [images]);
   
    return(
        images && !isLoading && (
            <div className="flexCenter">
                <img
                src={images[index].ImageURL}
                alt="Slideshow"
                style={{ width: '40%', height: 'auto' }}
            />
            </div>
        )
    )
}