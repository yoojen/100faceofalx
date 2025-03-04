import useRefreshToken from '../../hooks/useRefreshToken';

const Homepage = () => {
    const refresh = useRefreshToken();
    return (
        <div className='text-2xl'>
            <h1>Homepage</h1>
            <button onClick={()=>refresh()}>Refresh</button>
        </div>
    )
}

export default Homepage;