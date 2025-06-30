export default function ArticleCard() {
    return(
        <div className="hover:scale-105 transition-transform border shadow-lg rounded-lg bg-slate-100 cursor-pointer">
            <div className="overflow-hidden" onClick={()=>{console.log('Article');}}>
                <img 
                src="logo512.png"
                alt=""
                className="rounded-t-lg object-center flex m-auto"/>
            </div>
            <div className="p-5">
                <h2 className="text-2xl truncate font-black">
                    Título de artículo
                </h2>
                <p className="text-justify">
                    Lorem ipsum dolor sit amet consectetur adipiscing elit consequat, convallis est sem egestas tortor felis hendrerit suspendisse, duis accumsan in ullamcorper potenti sociosqu litora, ac magna penatibus eros facilisis nec cursus. Platea morbi vestibulum leo tempor erat aliquet euismod taciti porttitor blandit, nulla turpis libero per a viverra pretium ante ridiculus, nullam velit rhoncus nisi commodo dignissim lobortis pulvinar justo.
                </p>
            </div>
        </div>
    )
}