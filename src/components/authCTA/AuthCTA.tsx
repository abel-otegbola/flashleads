import { Link } from "react-router-dom";
import Button from "../button/Button";

export const AuthCTA = ({ user }: { user: { email?: string } | null }) => {
    if (user) {
        return (
            <Link to={"/account"} className="w-9 h-9 rounded-full bg-gray text-white aspect-square border border-gray/[0.2] flex items-center justify-center font-semibold">
                <img src="/profile.jpg" width={36} height={36} className="rounded-full aspect-square" />
            </Link>
        );
    }

    return (
        <>
            <Button href="/login" variant="secondary" className="md:w-fit w-full">Login</Button>
            <Button href="/signup" className="md:w-fit w-full">Sign up</Button>
        </>
    );
}