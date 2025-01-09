import { Briefcase, Home, User, Users } from "lucide-react";

const menuItems = [
	{
		category: "Main",
		items: [
			{ name: "Dashboard", icon: Home, path: "/dashboard" },
			{ name: "Division", icon: Briefcase, path: "/divisions" },
			{ name: "Employee", icon: Users, path: "/employees" },
		],
	},
	{
		category: "User",
		items: [{ name: "Profile", icon: User, path: "/profile" }],
	},
];

export default menuItems;
