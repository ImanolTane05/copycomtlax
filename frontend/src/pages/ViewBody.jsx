import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";
import ViewContent from "../components/ViewContent";

function ViewBody() {
    const {id}=useParams();
    const [article,setArticle]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [error,setError]=useState(null);

    const [noticias,setNoticias]=useState([]);

    useEffect(()=>{
        const fetchArticle=async()=>{
            try {
                const res=await axios.get(`${import.meta.env.VITE_BASE_URL}/noticias/${id}`)
                setArticle(res.data);
            } catch (err) {
                setError(err);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchArticle();
    },[id]);

    if (isLoading) {
        return <FaSpinner className="loading-icon"/>
    }
    if (error) {
        return <ErrorMessage error={error} message={"Error al recuperar la noticia."}/>
    }
    if (!article) {
        return <div className="absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]">No se encontró la noticia.</div>
    }

    return (
        <ViewContent editorStateString={article.body}/>
    )
}

export default ViewBody;