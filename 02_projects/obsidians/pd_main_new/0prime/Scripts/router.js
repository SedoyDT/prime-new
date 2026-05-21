module.exports = async (params) => {
    const input = await params.quickAddApi.inputPrompt("Введите заметку:");
    if (!input) return;

    let targetFile = "Inbox.md";

    const text = input.toLowerCase();

    // 🧭 РОУТИНГ ПО СМЫСЛОВЫМ ПОДСТРОКАМ

    // Работа / задачи
    if (
        text.includes("работ") ||
        text.includes("проект") ||
        text.includes("задач") ||
        text.includes("отчёт") ||
        text.includes("код")
    ) {
        targetFile = "Work.md";
    }

    // Идеи
    else if (
        text.includes("идея") ||
        text.includes("продукт") ||
        text.includes("стартап") ||
        text.includes("концепт") ||
        text.includes("придум")
    ) {
        targetFile = "Ideas.md";
    }

    // Финансы
    else if (
        text.includes("деньги") ||
        text.includes("оплат") ||
        text.includes("счёт") ||
        text.includes("покуп") ||
        text.includes("инвест")
    ) {
        targetFile = "Finance.md";
    }

    // Здоровье
    else if (
        text.includes("здоров") ||
        text.includes("спорт") ||
        text.includes("трениров") ||
        text.includes("бег") ||
        text.includes("сон")
    ) {
        targetFile = "Health.md";
    }

    // Дневник (если явно про день/события)
    else if (
        text.includes("сегодня") ||
        text.includes("день") ||
        text.includes("случилось") ||
        text.includes("запомнить")
    ) {
        targetFile = `Journal/${tp.date.now("YYYY-MM-DD")}.md`;
    }

    // 🧹 запись без изменений
    const line = `- ${tp.date.now("HH:mm")} ${input}\n`;

    await params.app.vault.adapter.append(targetFile, line);
};