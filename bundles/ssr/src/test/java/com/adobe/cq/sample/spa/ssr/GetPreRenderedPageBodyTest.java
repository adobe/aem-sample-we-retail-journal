/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.sample.spa.ssr;


import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.jetbrains.annotations.Nullable;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.powermock.reflect.Whitebox;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.sample.spa.ssr.context.TestContext;
import com.adobe.cq.sightly.WCMBindings;
import com.adobe.cq.wcm.core.components.testing.MockAdapterFactory;
import com.adobe.cq.wcm.core.components.testing.MockResponsiveGrid;
import com.adobe.cq.wcm.core.components.testing.MockStyle;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Template;
import com.day.cq.wcm.api.TemplateManager;
import com.day.cq.wcm.api.components.ComponentContext;
import com.day.cq.wcm.api.designer.Style;
import com.day.cq.wcm.api.policies.ContentPolicy;
import com.day.cq.wcm.api.policies.ContentPolicyManager;
import com.day.cq.wcm.api.policies.ContentPolicyMapping;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import com.google.common.base.Function;
import io.wcm.testing.mock.aem.junit.AemContext;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link GetPreRenderedPageBody} servlet
 */
@RunWith(MockitoJUnitRunner.class)
public class GetPreRenderedPageBodyTest extends SlingSafeMethodsServlet {

    private static final String TEST_BASE = "/page";
    private static final String CONTEXT_PATH = "/test";
    private static final String ROOT = "/content";
    private static final String POLICIES_MAPPING_PATH = "policies/jcr:content";
    private static final String DEFAULT_HOST_REACT = "http://localhost:4200";
    private static final String DEFAULT_HOST_ANGULAR = "http://localhost:4000";
    private static final String ROOT_PAGE_TEMPLATE_PATH = "/conf/coretest/settings/wcm/templates/rootpagetemplate";

    private static final String APP_ROOT_PATH = ROOT + "/react";

    @ClassRule
    public static final AemContext CONTEXT = TestContext.createContext();

    protected static MockSlingHttpServletRequest request;

    @Mock
    protected static ResourceResolver resolver;

    @Mock
    protected static ContentPolicyManager contentPolicyManager;

    @Mock
    protected static TemplateManager templateManager;

    @Mock
    protected static ComponentContext componentContext;

    @Mock
    protected ModelFactory modelFactory;

    protected Resource resourceSpy;

    protected com.day.cq.wcm.api.Page page;


    @BeforeClass
    public static void beforeClass() {
        CONTEXT.load().json(TEST_BASE + TestContext.TEST_CONTENT_JSON, ROOT);
        CONTEXT.load().json(TEST_BASE + "/test-conf.json", "/conf/coretest/settings");
        CONTEXT.load().json(TEST_BASE + "/default-tags.json", "/etc/tags/default");
    }

    @Before
    public void before() {
        resolver = spy(CONTEXT.resourceResolver());
        request = spy(new MockSlingHttpServletRequest(resolver, CONTEXT.bundleContext()));

        resolver = spy(CONTEXT.resourceResolver());
        request = spy(new MockSlingHttpServletRequest(resolver, CONTEXT.bundleContext()));

        Resource resource = CONTEXT.resourceResolver().getResource(APP_ROOT_PATH + "/" + JcrConstants.JCR_CONTENT);

        if (resource == null) {
            throw new IllegalStateException("Did you forget to define test resourceSpy " + APP_ROOT_PATH + "?");
        }

        resourceSpy = spy(resource);

        CONTEXT.registerInjectActivateService(new MockAdapterFactory());
        CONTEXT.registerService(ModelFactory.class, modelFactory);
        CONTEXT.registerAdapter(ResourceResolver.class, ContentPolicyManager.class,
                new Function<ResourceResolver, ContentPolicyManager>() {
                    @Nullable
                    @Override
                    public ContentPolicyManager apply(@Nullable ResourceResolver resolver) {
                        return contentPolicyManager;
                    }
                });
        CONTEXT.addModelsForClasses(MockResponsiveGrid.class);
        CONTEXT.registerService(SlingModelFilter.class, new SlingModelFilter() {

            private final Set<String> IGNORED_NODE_NAMES = new HashSet<String>() {{
                add(NameConstants.NN_RESPONSIVE_CONFIG);
                add(MSMNameConstants.NT_LIVE_SYNC_CONFIG);
                add("cq:annotations");
            }};

            @Override
            public Map<String, Object> filterProperties(Map<String, Object> map) {
                return map;
            }

            @Override
            public Iterable<Resource> filterChildResources(Iterable<Resource> childResources) {
                return StreamSupport
                        .stream(childResources.spliterator(), false)
                        .filter(r -> !IGNORED_NODE_NAMES.contains(r.getName()))
                        .collect(Collectors.toList());
            }
        });

        when(resourceSpy.listChildren()).thenReturn(resource.listChildren());

        page = CONTEXT.pageManager().getPage(APP_ROOT_PATH);
        componentContext = mock(ComponentContext.class);

        SlingBindings slingBindings = new SlingBindings();

        Resource templateResource = CONTEXT.resourceResolver().getResource(ROOT_PAGE_TEMPLATE_PATH);
        Template template = mock(Template.class);
        when(template.adaptTo(Resource.class)).thenReturn(templateResource);
        when(template.hasStructureSupport()).thenReturn(false);
        contentPolicyManager = mock(ContentPolicyManager.class);
        templateManager = mock(TemplateManager.class);
        when(resolver.adaptTo(TemplateManager.class)).thenReturn(templateManager);

        ContentPolicyMapping mapping = templateResource.getChild(POLICIES_MAPPING_PATH).adaptTo(ContentPolicyMapping.class);
        ContentPolicy contentPolicy = mapping.getPolicy();
        Style style;

        if (contentPolicy != null) {
            Resource contentPolicyResource = CONTEXT.resourceResolver().getResource(contentPolicy.getPath());
            style = new MockStyle(contentPolicyResource, contentPolicyResource.adaptTo(ValueMap.class));
        } else {
            style = mock(Style.class);
            when(style.get(anyString(), Matchers.anyObject())).thenAnswer(
                    invocationOnMock -> invocationOnMock.getArguments()[1]
            );
        }

        Set<String> cssClassNames = new LinkedHashSet<>(Arrays.asList("class1", "class2"));
        when(componentContext.getCssClassNames()).thenReturn(cssClassNames);
        slingBindings.put(WCMBindings.CURRENT_STYLE, style);
        slingBindings.put(SlingBindings.RESOLVER, request.getResourceResolver());
        slingBindings.put(WCMBindings.CURRENT_PAGE, page);
        slingBindings.put(WCMBindings.PAGE_MANAGER, CONTEXT.pageManager());
        slingBindings.put(SlingBindings.RESOURCE, resourceSpy);
        slingBindings.put(WCMBindings.PAGE_PROPERTIES, page.getProperties());
        slingBindings.put(WCMBindings.COMPONENT_CONTEXT, componentContext);
        request.setContextPath(CONTEXT_PATH);
        request.setResource(resourceSpy);
        slingBindings.put(SlingBindings.REQUEST, request);
        when(request.getAttribute(eq("com.day.cq.wcm.componentcontext"))).thenReturn(componentContext);
        request.setAttribute(SlingBindings.class.getName(), slingBindings);
    }

    @Test
    public void testServletOutput() throws ServletException, IOException {
        String responseData = "test data";
        InputStream anyInputStream = new ByteArrayInputStream(responseData.getBytes());

        GetPreRenderedPageBody servlet = new GetPreRenderedPageBody();

        GetPreRenderedPageBody.Configuration configurationMock = mock(GetPreRenderedPageBody.Configuration.class);
        when(configurationMock.sample_spa_ssr_react_server()).thenReturn(DEFAULT_HOST_REACT);
        when(configurationMock.sample_spa_ssr_angular_server()).thenReturn(DEFAULT_HOST_ANGULAR);

        HttpClientBuilderFactory clientBuilderFactory =  mock(HttpClientBuilderFactory.class);
        CloseableHttpClient closeableHttpClientMock =  mock(CloseableHttpClient.class);
        CloseableHttpResponse closeableHttpResponseMock =  mock(CloseableHttpResponse.class);
        SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);
        HttpEntity httpEntityMock =  mock(HttpEntity.class);
        StatusLine statusLineMock =  mock(StatusLine.class);
        PrintWriter printWriterMock =  mock(PrintWriter.class);

        when(clientBuilderFactory.newBuilder()).thenReturn(mock(HttpClientBuilder.class));
        when(clientBuilderFactory.newBuilder().build()).thenReturn(closeableHttpClientMock);
        when(closeableHttpClientMock.execute(any())).thenReturn(closeableHttpResponseMock);
        when(closeableHttpResponseMock.getEntity()).thenReturn(httpEntityMock);
        when(closeableHttpResponseMock.getStatusLine()).thenReturn(statusLineMock);
        when(statusLineMock.getStatusCode()).thenReturn(HttpServletResponse.SC_OK);
        when(httpEntityMock.getContent()).thenReturn(anyInputStream);
        when(response.getWriter()).thenReturn(printWriterMock);
        Whitebox.setInternalState(servlet, "clientBuilderFactory", clientBuilderFactory);

        when(request.getPathInfo()).thenReturn("react");

        servlet.activate(configurationMock);
        servlet.doGet(request, response);

        verify(printWriterMock).write(eq(responseData));
    }

}
