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


import java.io.IOException;

import org.jetbrains.annotations.NotNull;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sample.spa.journal.models.HierarchyPage;
import com.day.cq.wcm.api.WCMMode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component(
        service = {Servlet.class},
        property = {
                "sling.servlet.resourceTypes=cq/spa/ssr",
                "sling.servlet.methods=GET"
        }
)
@Designate( ocd = GetPreRenderedPageBody.Configuration.class )
/**
 * Service responsible for fetching Server-Side pre-rendered HTML content
 */
public class GetPreRenderedPageBody extends SlingSafeMethodsServlet {

    private static final Logger log = LoggerFactory.getLogger(GetPreRenderedPageBody.class);

    private static final String ANGULAR_SELECTOR = "angular";
    private static final String DEFAULT_HOST_REACT = "http://localhost:4200";
    private static final String DEFAULT_HOST_ANGULAR = "http://localhost:4000";

    @Reference
    private HttpClientBuilderFactory clientBuilderFactory;

    private String host_react;
    private String host_angular;


    @Activate
    protected void activate(Configuration configuration) {
        host_react = configuration.sample_spa_ssr_react_server();
        host_angular = configuration.sample_spa_ssr_angular_server();
    }

    @Override
    protected void doGet(@NotNull SlingHttpServletRequest request, @NotNull SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            // this should come from a config
            final String HOST = request.getPathInfo().toLowerCase().contains(ANGULAR_SELECTOR) ? host_angular : host_react;
            final String URL = HOST + request.getPathInfo();

            CloseableHttpClient client = clientBuilderFactory.newBuilder().build();

            ObjectMapper mapper = new ObjectMapper();

            HierarchyPage rootPage = getRootModel(request);

            StringEntity requestData = new StringEntity(
                    mapper.writeValueAsString(rootPage),
                    ContentType.APPLICATION_JSON);

            HttpPost postMethod = new HttpPost(URL);
            postMethod.setEntity(requestData);
            postMethod.setHeader("WCM-Mode", WCMMode.fromRequest(request).toString());
            postMethod.setHeader("Page-Model-Root-URL", rootPage.getExportedPath());

            CloseableHttpResponse preRenderedResponse = client.execute(postMethod);

            String responseBody = EntityUtils.toString(preRenderedResponse.getEntity());

            int statusCode = preRenderedResponse.getStatusLine().getStatusCode();

            if (statusCode >= 400) {
                throw new IOException("Rendering App server-side finished with error code: " + statusCode
                        + " and message: " + responseBody);
            }

            response.getWriter().write(responseBody);

        } catch (IOException | NullPointerException e) {
            // TODO: different problems may result in different error handling and codes
            log.error("Error while trying to Render App server-side: " + e.getMessage(), e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.toString());
        }
    }

    /**
     * Returns the page converted into a JSON string
     *
     * @param request
     * @return
     * @throws JsonProcessingException
     */
    private HierarchyPage getRootModel(SlingHttpServletRequest request) throws JsonProcessingException {
        HierarchyPage page = request.adaptTo(HierarchyPage.class);

        if (page == null) {
            return null;
        }


        return  page.getRootModel();
    }

    @ObjectClassDefinition(name="Single Page Applications - Server Side Rendering Configuration",
            description = "URLs of the servers responsible for returning the HTML based on the model data send in request")
    @interface Configuration {
        @AttributeDefinition(
                name = "React Node Server URL",
                description = "full URL, i.e. " + DEFAULT_HOST_REACT,
                type = AttributeType.STRING
        )
        String sample_spa_ssr_react_server() default DEFAULT_HOST_REACT;

        @AttributeDefinition(
                name = "Angular Node Server URL",
                description = "full URL, i.e. " + DEFAULT_HOST_ANGULAR,
                type = AttributeType.STRING
        )
        String sample_spa_ssr_angular_server() default DEFAULT_HOST_ANGULAR;
    }


}
