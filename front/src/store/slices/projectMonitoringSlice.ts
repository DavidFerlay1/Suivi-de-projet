import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiteProjectTask, Project, ProjectStatus, ProjectTask } from "src/interfaces/Project";

type SliceState = {project?: Project, flatTaskList: ProjectTask[]};

const initialState: SliceState = {
    project: undefined,
    flatTaskList: []
};

const projectMonitoringSlice = createSlice({
    initialState,
    name: 'projectMonitoring',
    reducers: {
        setProject: (state, action: PayloadAction<Project>) => {
            state = {...state, project: action.payload, flatTaskList: getTasksFlatList(action.payload.tasks)};
            return state;
        },

        setTaskAchieved: (state, action: PayloadAction<ProjectTask>) => {
            if(state.project) {
                const updatedTask = action.payload;
                const flatListCopy = [...state.flatTaskList];

                const index = flatListCopy.findIndex(task => task.id === updatedTask.id);
                flatListCopy[index] = updatedTask;

                const {rootTask, updatedFlatList} = updateFlatListAchievement(updatedTask, flatListCopy);
                const projectTasksCopy = [...state.project.tasks];
                const tasksIndex = projectTasksCopy.findIndex(task => task.id === rootTask.id);

                projectTasksCopy[tasksIndex] = updateTaskBranch(rootTask, flatListCopy);

                return {...state, flatTaskList: updatedFlatList, project: {...state.project, tasks: projectTasksCopy}};
            }
            
            return;
        }
    }
})


const getTasksFlatList = (tasks: ProjectTask[], flatList: ProjectTask[] = []) => {
    for(const task of tasks) {
        flatList.push(task);
        if(task.tasks.length)
            getTasksFlatList(task.tasks, flatList);
    }

    return flatList;
}

const getRootTaskId = (childTask: ProjectTask|LiteProjectTask): number => {
    if(childTask.parent) {
        return getRootTaskId(childTask.parent);
    }

    return childTask.id!;
}

const updateFlatListAchievement = (updatedTask: ProjectTask, flatList: ProjectTask[], breakLoop = false): {rootTask: ProjectTask, updatedFlatList: ProjectTask[]} => {

    const parentTask = updatedTask.parent ? flatList.find(task => task.parent?.id === task.id) : undefined;

    if(breakLoop) {
        if(parentTask) {
            return updateFlatListAchievement(parentTask, flatList, breakLoop);
        }

        return {
            rootTask: updatedTask,
            updatedFlatList: flatList
        }

    }

    let allChildrenAchived = true;
    const children = flatList.filter(task => task.parent && task.parent.id === updatedTask.id);

    for(const child of children) {
        if(child.status !== ProjectStatus.ACHIVIED) {
            allChildrenAchived = false;
            break;
        }
    }

    if(allChildrenAchived)
        updatedTask.status = ProjectStatus.ACHIVIED;
    else if(updatedTask.status === ProjectStatus.ACHIVIED)
        updatedTask.status = ProjectStatus.IN_PROGRESS;
    else
        breakLoop = true;

    flatList[flatList.findIndex(task => task.id === updatedTask.id)] = updatedTask;

    if(parentTask)
        return updateFlatListAchievement(parentTask, flatList, breakLoop);

    return {
        rootTask: updatedTask,
        updatedFlatList: flatList
    }
}

const updateTaskBranch = (task: ProjectTask, flatList: ProjectTask[]): ProjectTask => {

    const updatedtasks = [];

    for(let i = 0; i < task.tasks.length; i++) {
        updatedtasks.push(updateTaskBranch(task.tasks[i]!, flatList));
    }

    return {...task, tasks: updatedtasks};
}

export const {setProject, setTaskAchieved} = projectMonitoringSlice.actions;
export default projectMonitoringSlice;