import fs from "fs"

export const bufferToString = (buffer, encoding = "ascii") => {
    return Buffer.from(buffer).toString(encoding);
};

export const findAllControllerFiles = () => {
    const controllerFiles = [];
    const controllerFolder = process.cwd() + "/src/controllers"

    function findControllerFiles(currentDirectory) {
        fs.readdirSync(currentDirectory, { withFileTypes: true }).forEach(
            (currentFile) => {

                if (currentFile.isDirectory()) {
                    findControllerFiles(currentDirectory + "/" + currentFile.name)
                    return;
                }

                controllerFiles.push(currentDirectory + "/" + currentFile.name);
            });
    }
    findControllerFiles(controllerFolder)
    return controllerFiles
};