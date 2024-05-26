import { describe, expect, test } from 'bun:test';
import { buildChecklist } from './checklists';

describe('checklists', () => {
  describe('buildChecklist', () => {
    test('should return checklist correctly', () => {
      const checklist = buildChecklist();

      expect(checklist).toEqual({
        containPackageJson: {
          key: 'contain_package_json',
          completed: true,
          reason: null,
        },
        containMainJs: {
          key: 'contain_main_js',
          completed: true,
          reason: null,
        },
        mainJSContainStudentID: {
          key: 'main_js_contain_student_id',
          completed: true,
          reason: null,
        },
        rootShouldShowingHTML: {
          key: 'root_should_showing_html',
          completed: true,
          reason: null,
        },
        htmlShouldContainH1AndStudentId: {
          key: 'html_should_contain_h1_and_student_id',
          completed: true,
          reason: null,
        },
        appPortShould5000: {
          key: 'app_port_should_5000',
          completed: true,
          reason: null,
        },
      });
    });
  });
});
