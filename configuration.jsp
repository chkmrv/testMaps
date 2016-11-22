<%@ include file="init.jsp" %>

<%
String redirect = ParamUtil.getString(request, "redirect");
%>

<liferay-portlet:actionURL portletConfiguration="true" var="configurationURL" />

<aui:form action="<%=configurationURL%>" method="post" name="fm">
    <aui:input name="<%=Constants.CMD%>" type="hidden" value="<%=Constants.UPDATE%>" />
    <aui:input name="redirect" type="hidden" value="<%=redirect%>" />

    <liferay-ui:panel-container extended="<%= true %>" persistState="<%= true %>">
	    <liferay-ui:panel collapsible="<%= true %>" extended="<%= true %>" persistState="<%= true %>" title="carousel-images">
			<aui:fieldset cssClass="carousel-images">

				<script type="text/javascript" src="/rrwebContactMaps-portlet/js/donors/babel-core.min.js"></script>
				<script type="text/javascript" src="/rrwebContactMaps-portlet/js/donors/jquery.min.js"></script>
				<script type="text/javascript" src="/rrwebContactMaps-portlet/js/donors/require.js"></script>

				<script type="text/javascript" >
					require.config({
						paths: {
							"react": "/rrwebContactMaps-portlet/js/donors/react",
							"react-dom": "/rrwebContactMaps-portlet/js/donors/react-dom",
							"library": "/rrwebContactMaps-portlet/js/library",
							},
							waitSeconds: 15
						});

				</script>

				<div id="container-conf"></div>

				<script type="text/javascript" src="/rrwebContactMaps-portlet/js/main-conf.js"></script>
				<link rel="stylesheet" type="text/css" href="/rrwebContactMaps-portlet/css/main.css">


			</aui:fieldset>
		</liferay-ui:panel>
    </liferay-ui:panel-container>

	<aui:button-row>
        <aui:button type="submit" />
    </aui:button-row>
</aui:form>

<aui:script use="liferay-auto-fields">
    new Liferay.AutoFields(
        {
            contentBox: 'fieldset.carousel-images',
            fieldIndexes: '<portlet:namespace />carouselImagesIndexes'
        }
    ).render();
</aui:script>
