"""Resource to call Keycloak Service API calls and filter responses"""
from http import HTTPStatus
from pprint import pprint
from flask import request
from flask_restx import Namespace, Resource
from marshmallow import ValidationError

from formsflow_api.services import KeycloakAdminAPIService
from formsflow_api.schemas import ApplicationListReqSchema, KeycloakDashboardGroupSchema
from formsflow_api.utils import (
    KEYCLOAK_DASHBOARD_BASE_GROUP,
    auth,
    cors_preflight,
    profiletime,
)

API = Namespace("groups", description="Keycloak wrapper APIs")


@cors_preflight("GET, OPTIONS")
@API.route("", methods=["GET", "OPTIONS"])
class KeycloakDashboardGroupList(Resource):
    """Resource to fetch Dashboard List"""

    @staticmethod
    @auth.require
    @profiletime
    def get():
        """GET request to fetch all dashboard groups from Keycloak
        :params int pageNo: page number (optional)
        :params int limit: number of items per page (optional)
        """
        client = KeycloakAdminAPIService()
        if request.args:
            dict_data = ApplicationListReqSchema().load(request.args)
            page_no = dict_data["page_no"]
            limit = dict_data["limit"]
        else:
            page_no = 0
            limit = 0

        if page_no == 0 and limit == 0:
            group_list_response = client.get_request(url_path="groups")
        else:
            group_list_response = client.get_paginated_request(
                url_path="groups", first=page_no, max=limit
            )


        for group in group_list_response:
            if group["name"] == KEYCLOAK_DASHBOARD_BASE_GROUP:
                dashboard_group_list = [x for x in group["subGroups"]]
                if dashboard_group_list == []:
                    return {
                        "message": "No Dashboard authorized Group found"
                    }, HTTPStatus.NOT_FOUND
                else:
                    for group in dashboard_group_list:
                        group["dashboards"] = (
                            client.get_request(url_path=f"groups/{group['id']}")
                            .get("attributes")
                            .get("dashboards")
                        )
                    return dashboard_group_list, HTTPStatus.OK


@cors_preflight("GET,PUT,OPTIONS")
@API.route("/<string:id>", methods=["GET", "PUT", "OPTIONS"])
class KeycloakDashboardGroupDetail(Resource):
    @staticmethod
    @auth.require
    @profiletime
    def get(id):
        """GET request to fetch groups details API
        :params str id: group-id of Keycloak Dashboard Authorized groups
        """
        client = KeycloakAdminAPIService()
        response = client.get_request(url_path=f"groups/{id}")
        if response is None:
            return {"message": f"Group - {id} not found"}, HTTPStatus.NOT_FOUND
        return response

    @staticmethod
    @auth.require
    @profiletime
    def put(id):
        """Update request to update dashboard details
        :params str id: group-id of Keycloak Dashboard Authorized groups
        """
        client = KeycloakAdminAPIService()
        group_json = request.get_json()
        try:
            dict_data = KeycloakDashboardGroupSchema().load(group_json)

            dashboard_id_details = client.get_request(url_path=f"groups/{id}")
            if dashboard_id_details == None:
                return {"message": f"Group - {id} not found"}, HTTPStatus.NOT_FOUND
            else:
                dashboard_id_details["attributes"]["dashboards"] = [
                    str(dict_data["dashboards"])
                ]
                response = client.update_request(
                    url_path=f"groups/{id}", data=dashboard_id_details
                )
                return response
        except ValidationError as err:
            pprint(err.messages)
            return {"message": "Invalid Request Object format"}, HTTPStatus.BAD_REQUEST