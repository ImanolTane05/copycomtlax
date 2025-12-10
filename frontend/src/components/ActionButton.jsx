// La mayor parte del tiempo el botón requerirá que se ejecute e.preventDefault() en la función pasada por onClick

export default function ActionButton({
    onClick,
    color,
    hoverColor,
    activeColor,
    textColor,
    textHoverColor,
    style,
    children
}) {
    return <button
        onClick={onClick}
        className={`mt-4 ${color} ${activeColor && `active:${activeColor}`} ${hoverColor && `hover:${hoverColor}`} ${textColor ? textColor : "text-white"} ${textHoverColor && `hover:${textHoverColor}`} px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all cursor-pointer ${style}`}
    >
        {children}
    </button>
}