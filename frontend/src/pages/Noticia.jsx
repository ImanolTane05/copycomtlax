import ArticleCard from "../components/ArticleCard";

const Noticia=({id})=> {
    // TODO obtener detalles de noticia
    return (
        <div className="grid-cols-2">
            <span className="grid-cols-subgrid m-5">
            <h1 className="font-bold text-center">Lorem Ipsum</h1>
            <img src="logo512.png" className="content-center"></img>
            <h3 className="text-justify">Lorem ipsum dolor sit amet consectetur adipiscing elit consequat, convallis est sem egestas tortor felis hendrerit suspendisse.</h3>
            <div className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipiscing elit consequat, convallis est sem egestas tortor felis hendrerit suspendisse, duis accumsan in ullamcorper potenti sociosqu litora, ac magna penatibus eros facilisis nec cursus. Platea morbi vestibulum leo tempor erat aliquet euismod taciti porttitor blandit, nulla turpis libero per a viverra pretium ante ridiculus, nullam velit rhoncus nisi commodo dignissim lobortis pulvinar justo.
            </div>
            </span>
            <span>
                <div>Anuncios recientes</div>
                <ArticleCard/>
            </span>
        </div>
    );
}

export default Noticia;