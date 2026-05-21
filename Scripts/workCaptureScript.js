module.exports = async (params) => {
    const { app, quickAddApi } = params;

    // 1. Получаем список проектов из папки
    const projectFolder = "02_projects";
    const files = app.vault.getAbstractFileByPath(projectFolder);

    let projects = [];

    if (files && files.children) {
        projects = files.children
            .filter(f => f.children) // папки
            .map(f => f.name);
    }

    // 2. Добавляем опцию создания нового
    const options = [...projects, "+ New Project"];

    const selected = await quickAddApi.suggester(options, options);

    let project = selected;

    // 3. Создание нового проекта
    if (selected === "+ New Project") {
        project = await quickAddApi.inputPrompt("Project name");

        await app.vault.createFolder(`${projectFolder}/${project}`);

        await app.vault.create(
            `${projectFolder}/${project}/README.md`,
            `# ${project}\n\n`
        );
    }

    // 4. Ввод заметки
    const note = await quickAddApi.inputPrompt("Work note");

    if (!note) return;

    // 5. Создание файла
    const timestamp = window.moment().format("YYYY-MM-DD HH-mm");

    const path = `${projectFolder}/${project}/${timestamp}.md`;

    await app.vault.create(
        path,
        `# ${note}\n\n`
    );
};