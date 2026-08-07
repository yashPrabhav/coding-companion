function SidebarItem({
    title,
    icon,
    active,
    onClick
}) {

    return (

        <div
            className={`sidebar-item ${active ? "active" : ""}`}
            onClick={onClick}
        >

            <span>{icon}</span>

            <span>{title}</span>

        </div>

    );

}

export default SidebarItem;