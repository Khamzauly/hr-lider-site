# 21st.dev / Shadcn Registry

Проект подготовлен к установке компонентов из 21st.dev через shadcn registry.

## Как ставить компонент

1. Открыть нужный компонент на `https://21st.dev`.
2. Скопировать команду установки.
3. Запустить ее из корня проекта, например:

```bash
npx shadcn@latest add "https://21st.dev/r/shadcn/accordion"
```

21st.dev компоненты обычно ставятся как shadcn-style файлы в `src/app/components/ui` и используют Tailwind/Radix/lucide.

## Конфигурация

Файл `components.json` уже настроен:

- `components`: `src/app/components`
- `ui`: `src/app/components/ui`
- `utils`: `src/app/components/ui/utils`
- CSS: `src/styles/index.css`

После установки компонента проверять:

```bash
npm run build
npm audit --omit=dev
```

## Важно

Компоненты из 21st.dev могут перезаписывать существующие shadcn/ui файлы. Перед установкой конкретного компонента желательно посмотреть список файлов, который CLI предлагает изменить.
