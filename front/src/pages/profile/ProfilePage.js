import FullPageLayout from "../../components/layouts/fullPageLayout/FullPageLayout"

const { useState } = require("react")

const ProfilePage = () => {
    const [data, setData] = useState({
        firstname: "John"
    })

    return (
        <FullPageLayout>
            test
        </FullPageLayout>
    )
}

export default ProfilePage;