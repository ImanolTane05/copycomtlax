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
        <div key={id} className="hover:scale-105 transition-transform border shadow-lg rounded-lg bg-slate-100 cursor-pointer"
        onClick={handleClick}
        >
            <div className="overflow-hidden">
                <img 
                src={image ?? "logo512.png"}
                alt=""
                className="rounded-t-lg object-center flex m-auto"/>
            </div>
            <div className="p-5">
                <h2 className="text-2xl truncate font-black">
                    {title ?? "Título de artículo"}
                </h2>
                <p className="text-justify resize-none h-auto min-w-[100px] w-11/12 whitespace-pre-wrap">
                    {lead}
                </p>
            </div>
        </div>
    )
}