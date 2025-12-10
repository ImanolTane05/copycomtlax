import { MdOutlineError,MdCloudOff } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import ActionButton from '../components/ActionButton';

export default function ErrorMessage({error,message}) {
    return <div className="text-gray-400 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]">
        {
            error.code==='ERR_NETWORK' ? 
              <MdCloudOff size={"15%"} color='#777' className='justify-center mx-auto'/>
            :
              <MdOutlineError size={"15%"} color='#777' className='justify-center mx-auto'/>
        }
        <p className='mx-auto text-center'>
            {error.code==='ERR_NETWORK' ? "Ocurrió un problema de conexión. Intenta recargar." : message}
        </p>
        <ActionButton 
            color={"bg-red-600"} 
            hoverColor={"bg-red-700"}
            activeColor={"bg-red-800"}
            style={"mx-auto"}
            onClick={(e)=>{
              e.preventDefault();
              window.location.reload();
            }}
        >
            <TbReload/> Reintentar
        </ActionButton>
    </div>;
}