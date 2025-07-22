import NoData from '../components/NoData'

const Users = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white p-8">
            <h1 className="text-2xl font-bold mb-4">Danh sách người dùng</h1>
            <div className="flex-1">
                <NoData message="Chưa cập nhật tính năng này" />
            </div>
        </div>
    )
}

export default Users
