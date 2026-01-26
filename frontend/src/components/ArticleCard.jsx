import { useNavigate } from "react-router-dom";
import Noticia from "../pages/Noticia";

export default function ArticleCard({
    id,
    title,
    lead,
    image,
    clickable,
    children
}) {
    const navigate=useNavigate();

    const handleClick=()=>{
        navigate(`/noticias/${id}`);
    }

    return(
        <div key={id} id={id} className={`flex flex-col shadow-2xl rounded-lg bg-gray-100 min-w-52 ${clickable && 'hover:scale-105 transition-transform cursor-pointer'}`}
            onClick={()=>{if (clickable) handleClick()}}
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
                <p className="whitespace-pre-line overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] text-justify h-auto min-w-[100px] w-11/12">
                    {lead}
                </p>
            </div>
            {children && 
            <div className="flex flex-row border-t-2 border-gray-200 mt-auto">
                {children}
            </div> 
            }
        </div>
    )
}