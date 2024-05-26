import { Checklists } from './types';

export function buildChecklist(completed = true): Checklists {
  const defaultProps = {
    completed,
    reason: null,
  };

  const checklists = {
    containPackageJson: {
      key: 'contain_package_json',
    },
    containMainJs: {
      key: 'contain_main_js',
    },
    mainJSContainStudentID: {
      key: 'main_js_contain_student_id',
    },
    rootShouldShowingHTML: {
      key: 'root_should_showing_html',
    },
    htmlShouldContainH1AndStudentId: {
      key: 'html_should_contain_h1_and_student_id',
    },
    appPortShould5000: {
      key: 'app_port_should_5000',
    },
  };

  return Object.keys(checklists).reduce((prev, key,) => ({ ...prev, [key]: { ...checklists[key], ...defaultProps } }), Object.assign({}));
}
