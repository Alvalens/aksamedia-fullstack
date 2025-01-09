import { Home, User, Users } from "lucide-react";

const menuItems = [
	{
		category: "Main",
		items: [
			{ name: "Dashboard", icon: Home, path: "/dashboard" },
			{ name: "Employee", icon: Users, path: "/employees" },
		],
	},
	{
		category: "User",
		items: [{ name: "Profile", icon: User, path: "/profile" }],
	},
];

export default menuItems;
