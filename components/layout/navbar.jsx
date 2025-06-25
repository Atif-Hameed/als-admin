"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { MdOutlineDashboard } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems = [
    { name: "Agents", href: "/admin/agents", icon: "/assets/dash-in.svg" },
    { name: "Plan", href: "/admin/plan", icon: "/assets/message-in.svg" },
    { name: "Web Pages", href: "/admin/web-pages", Icon: "/assets/dash-in.svg" },
    //   { name: "Properties", href: "/property", icon: "/assets/arro-in.svg" },
    //   { name: "Teams", href: "/teams", icon: "/assets/team.svg" },
    //   { name: "Referrals", href: "/referrals", icon: "/assets/agent-in.svg" },
    //   { name: "Messages", href: "/messages", icon: "/assets/review-in.svg" },
    //   { name: "Reviews", href: "/reviews", icon: "/assets/review-in.svg" },
    //   { name: "Contract", href: "/contract", icon: "/assets/review-in.svg" },
    //   { name: "Board", href: "/board", icon: "/assets/review-in.svg" },
];

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const router = useRouter();


    const handleLogout = () => {
        localStorage.removeItem("adminData");
        localStorage.removeItem("adminToken");
        // remove userId
        router.push("/"); // redirect to login page
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                toggleButtonRef.current &&
                !toggleButtonRef.current.contains(event.target)
            ) {
                closeDropdown();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative">
            <div className="flex bg-[#F4F9FD] items-center justify-between xl:gap-10 gap-2 md:gap-4 w-full">
                {/* <div className='flex items-center md:w-[40%] sm:w-[50%] w-[80%] bg-white px-4 py-3 rounded-lg '>
					<Image src='/assets/search.svg' alt='Search' width={16} height={16} />
					<input
						type='text'
						placeholder='Search goods...'
						className='outline-none w-full text-gray-700 ml-2'
					/>
				</div> */}
                {/* profile */}
                <div className="md:flex items-center hidden gap-3 bg-white px-4 py-1 rounded-lg shadow-sm">
                    <img
                        src={"/assets/dumy.png"}
                        alt="User Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="md:font-[700] md:text-[16px] text-[15px] font-[500] min-w-max text-[#0A1629]">
                        Admin
                    </span>
                </div>

                <div className="flex justify-end gap-4 items-center">
                    {/* toggler */}
                    <button
                        ref={toggleButtonRef}
                        className="bg-white p-3 md:hidden rounded-lg shadow-sm"
                        onClick={toggleDropdown}
                    >
                        <MdOutlineDashboard size={21} />
                    </button>

                    {/* dropdown for mobile */}
                    {isDropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className="absolute -top-4 -right-4 w-56 bg-white shadow-lg rounded-xl z-50 md:hidden"
                        >
                            <ul className="flex flex-col gap-2 p-3">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="flex items-center gap-3 p-2 rounded-md hover:bg-[#F4F9FD] transition-all text-gray-800"
                                            onClick={closeDropdown}
                                        >
                                            {/* check if icon is string or JSX */}
                                            {typeof item.icon === "string" ? (
                                                <Image
                                                    src={item.icon}
                                                    alt={item.name}
                                                    width={20}
                                                    height={20}
                                                />
                                            ) : (
                                                item.icon
                                            )}
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}

                                {/* Logout Button Only for Mobile */}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 p-2 w-full rounded-md hover:bg-[#F4F9FD] transition-all text-gray-800"
                                    >
                                        <Image
                                            src="/assets/logout.svg"
                                            alt="Logout"
                                            width={20}
                                            height={20}
                                        />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* logout button */}

                    <button
                        onClick={handleLogout}
                        className="bg-white px-4 py-2 rounded-lg shadow-sm text-[#E23442] font-medium hover:bg-red-50 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
