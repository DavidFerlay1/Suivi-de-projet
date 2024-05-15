import { useSelector } from "react-redux"
import { SortSetting } from "src/interfaces/Api/SortSetting";

const useQuerySorters = () => {
    const personalSetting = useSelector((state: any) => state.personal.profilesSortSetting)

    const getSortSettings = (type: 'personal'): SortSetting => {
        return personalSetting;
    }

    return {getSortSettings}
}

export default useQuerySorters;