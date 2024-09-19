import { logout } from '../actions/user';
const LogoutForm = () => {
    return (
        <form action={logout}>
            <button>Logout</button>
        </form>
    )
}

export default LogoutForm