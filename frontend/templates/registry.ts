import { TemplateProps } from "./types";

export interface TemplateDef {
  id: string;
  component: React.ComponentType<TemplateProps>;
}

const templates: TemplateDef[] = [];

export function registerTemplate(def: TemplateDef) {
  templates.push(def);
}

export function getTemplate(id: string): React.ComponentType<TemplateProps> | undefined {
  return templates.find((t) => t.id === id)?.component;
}

export function listTemplates(): string[] {
  return templates.map((t) => t.id);
}
