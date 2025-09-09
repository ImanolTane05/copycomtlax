import { useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import { useEffect, useState } from "react";
import axios from "axios";

import ViewContent from "../components/ViewContent";

import "../App.css";

const Noticia=()=> {
    const {id}=useParams();

    // Controladores de consulta en caso de carga o error
    const [article,setArticle]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [error,setError]=useState(null);

    const [noticias,setNoticias]=useState([]);

    useEffect(()=>{
        const fetchArticle=async()=>{
            try {
                const res=await axios.get(`http://localhost:5000/api/noticias/${id}`)
                setArticle(res.data);
            } catch (err) {
                setError("Error al recuperar el artículo.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchArticle();
    },[id]);

    useEffect(()=>{
        axios.get('http://localhost:5000/api/noticias/')
          .then(res=>setNoticias(res.data))
          .catch(err=>console.log("Error al cargar noticias:",err));
    },[]);

    if (isLoading) {
        return <>Cargando...</>
    }

    if (error) {
        return <>{error.message}</>
    }
    if (!article) {
        return <div>404 - No se encontró el artículo</div>
    }

    return (
        <div className="flex flex-col m-5">
            <article>
                <header className="flex flex-col">
                    <h1 className="text-center font-bold text-3xl">{article.title}</h1>
                    <br/>
                    <p className="whitespace-pre-wrap text-justify">{article.lead}</p>
                    <img 
                        src={article.headerPic} 
                        alt={article.title}
                        className="content-center"
                    />
                </header>
                <section className="m-[20px_auto]">
                    <ViewContent editorStateString={article.body}/>
                </section>
            </article>
            <span className="flex flex-col">
                <div>Anuncios recientes</div>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10">
                    {
                        noticias.map((noticia)=>(
                            <ArticleCard
                                key={noticia._id}
                                id={noticia._id}
                                title={noticia.title}
                                lead={noticia.lead}
                                image={noticia.headerPic}
                            />
                        ))
                    }
                </div>
            </span>
        </div>
    )
}

export default Noticia;