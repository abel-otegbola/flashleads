import { Link } from "react-router-dom";
import Button from "../button/Button";

export const AuthCTA = ({ user }: { user: { email?: string } | null }) => {
    if (user) {
        return (
            <Link to={"/account"} className="w-10 h-10 rounded-full bg-primary/[0.2] aspect-square outline outline-offset-2 outline-gray-200/[0.2] border border-gray-500/[0.2] flex items-center justify-center font-semibold">
                <img src="/profile.jpg" width={40} height={40} className="rounded-full aspect-square" />
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