
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<portlet:defineObjects />

<%@ include file="init.jsp"%>
<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
<script src="/rrwebContactMaps-portlet/js/map.js" type="text/javascript"></script>

<div class="container_contact">
	<div id="contact_header" style="height:auto;"> 
		<h1>Контакты</h1>
		<div class="tabs_contact">
			<ul class="tab__btn">
				<li class="active" data-page="0"> </li>
			</ul>

			<div>
				<div style="display: block;">
					<div class="item_phone"></div>
					<div class="item_fax"></div>
					<div class="item_email"></div>
					<div class="item_desc"></div>
				</div>
			</div>
		</div>
	</div>
</div>


<div id="map" style=""></div>
<div id="container" style=""></div>


