import { Link } from "react-router-dom";
import Button from "../button/Button";

export const AuthCTA = ({ user }: { user: { email?: string } | null }) => {
    if (user) {
        const email = user.email || '';
        const initial = email ? email[0].toUpperCase() : 'U';
        return (
            <Link to={"/account"} className="w-8 h-8 rounded-full bg-slate-300 text-white outline outline-offset-2 outline-gray-200/[0.2] border border-gray-500/[0.2] flex items-center justify-center font-semibold">
                {initial}
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