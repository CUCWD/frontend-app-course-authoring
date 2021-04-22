import React, {
  useCallback, useContext, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { history } from '@edx/frontend-platform';
import { Container } from '@edx/paragon';

import { useModel } from '../../../generic/model-store';
import { PagesAndResourcesContext } from '../../PagesAndResourcesProvider';
import { LOADED, selectApp } from '../data/slice';
import { saveAppConfig } from '../data/thunks';

import messages from './messages';
import AppConfigFormProvider, { AppConfigFormContext } from './AppConfigFormProvider';
import AppConfigFormApplyButton from './AppConfigFormApplyButton';
import LegacyConfigForm from './apps/legacy';
import LtiConfigForm from './apps/lti';

function AppConfigForm({
  courseId, intl,
}) {
  const dispatch = useDispatch();
  const { formRef } = useContext(AppConfigFormContext);
  const { path: pagesAndResourcesPath } = useContext(PagesAndResourcesContext);
  const { params: { appId: routeAppId } } = useRouteMatch();
  const { selectedAppId, status } = useSelector(state => state.discussions);
  const app = useModel('apps', selectedAppId);
  // appConfigs have no ID of their own, so we use the active app ID to reference them.
  // This appConfig may come back as null if the selectedAppId is not the activeAppId, i.e.,
  // if we're configuring a new app.
  const appConfig = useModel('appConfigs', selectedAppId);

  useEffect(() => {
    if (status === LOADED) {
      if (routeAppId !== selectedAppId) {
        dispatch(selectApp({ appId: routeAppId }));
      }
    }
  }, [selectedAppId, routeAppId, status]);

  // This is a callback that gets called after the form has been submitted successfully.
  const handleSubmit = useCallback((values) => {
    dispatch(saveAppConfig(courseId, selectedAppId, values)).then(() => {
      history.push(pagesAndResourcesPath);
    });
  }, [courseId, selectedAppId, courseId]);

  if (!selectedAppId || status !== LOADED) {
    return null;
  }

  let form = null;
  if (app.id === 'legacy') {
    form = (
      <LegacyConfigForm
        formRef={formRef}
        appConfig={appConfig}
        onSubmit={handleSubmit}
        title={intl.formatMessage(messages[`appName-${app.id}`])}
      />
    );
  } else {
    form = (
      <LtiConfigForm
        formRef={formRef}
        app={app}
        appConfig={appConfig}
        onSubmit={handleSubmit}
        title={intl.formatMessage(messages[`appName-${app.id}`])}
      />
    );
  }
  return (
    <Container size="sm" className="px-sm-0 py-5">
      {form}
    </Container>
  );
}

AppConfigForm.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

const IntlAppConfigForm = injectIntl(AppConfigForm);

IntlAppConfigForm.Provider = AppConfigFormProvider;
IntlAppConfigForm.ApplyButton = AppConfigFormApplyButton;

export default IntlAppConfigForm;