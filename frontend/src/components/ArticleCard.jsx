import { useNavigate } from "react-router-dom";
import Noticia from "../pages/Noticia";

export default function ArticleCard({
    id,
    title,
    lead,
    image
}) {
    const navigate=useNavigate();

    const handleClick=()=>{
        navigate(`/noticias/${id}`);
    }

    return(
        <div key={id} id={id} className="hover:scale-105 transition-transform border shadow-lg rounded-lg bg-slate-100 cursor-pointer min-w-52"
        onClick={handleClick}
        >
            {image ?
                <div className="overflow-hidden max-w-[95%] m-auto pt-2">
                    <img 
                    src={image}
                    alt={`image-${id}`}
                    className="m-auto"/>
                </div>
            : ""
            }
            <div className="p-5">
                <h2 className="text-2xl font-bold">
                    {title ?? "Título de artículo"}
                </h2>
                <p className="text-justify h-auto min-w-[100px] w-11/12">
                    {lead}
                </p>
            </div>
        </div>
    )
}