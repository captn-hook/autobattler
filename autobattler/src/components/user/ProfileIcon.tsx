'use client';
import { useUser } from "@/context/user/userContext";
import PersonIcon from "@mui/icons-material/Person";
import Image from "next/image";

export default function ProfileIcon() {
    const { user } = useUser();

    if (!user) {
        return (
            <PersonIcon
                width={24}
                height={24}
            />
        );
    } else {
        return (
            <Image
                src={user.photoURL || "/default-avatar.png"}
                alt={user.name || "User Avatar"}
                width={24}
                height={24}
                style={{ borderRadius: '50%' }}
            />
        );
    }
}
