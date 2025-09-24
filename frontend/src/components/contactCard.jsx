export default function contactCard(){
    return(
        <div className=" text-white p-1 rounded-lg shadow-md flex flex-col items-center justify-center w-full">
            <h3 className="text-xl font-bold mb-4 text-center text-blue-300">Contáctanos</h3>
            <p className="text-sm mb-3 text-center">
                ¡Estamos aquí para ayudarte! Envíanos un mensaje o encuéntranos.
            </p>
            <div className="text-center mb-4">
                <p className="text-sm mb-2">
                    <span className="font-semibold">Email: </span>{''}
                    <a href="mailto:copycomtlx@gmail.com" className="text-blue-400 hover:underline">
                        copycomtlx@gmail.com
                    </a>
                </p>
                <p className="text-sm">
                    <span className="font-semibold">Teléfono:</span> 246 175 4807
                </p>
            </div>
            
            <div className="flex spacer-x-4 mt-4">
                <a href="https://www.facebook.com/copycomtlx" target="_blank" rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 transition duration-300"
                >
                    <svg className="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-3 7h-1.924c-.615 0-1.076.252-1.076.974v1.864h3l-.333 3.5h-2.667v8.5h-3v-8.5h-2v-3.5h2v-2c0-2.485 1.489-3.89 3.778-3.89h2.222v3z"/>
                    </svg>
                </a>
            </div>
        </div>
    )
}