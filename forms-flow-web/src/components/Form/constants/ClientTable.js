// Import statements
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import {
  setBPMFormLimit,
  setBPMSubmitListPage,
  setBpmFormSearch,
  setBpmFormSort,
} from "../../../actions/formActions";
import { MULTITENANCY_ENABLED } from "../../../constants/constants";
import { useTranslation, Translation } from "react-i18next";
import { TableFooter } from "@formsflow/components";
import LoadingOverlay from "react-loading-overlay-ts";
import SortableHeader from '../../CustomComponents/SortableHeader';
import { formatDate } from "../../../helper/dateTimeHelper";

function ClientTable() {
  // Redux hooks and state management
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const bpmForms = useSelector((state) => state.bpmForms);
  const searchFormLoading = useSelector((state) => state.formCheckList.searchFormLoading);
  
  // Local state
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);
  const [search, setSearch] = useState(useSelector((state) => state.bpmForms.searchText) || "");

  // Derived state from Redux
  const formData = bpmForms?.forms || [];
  const pageNo = useSelector((state) => state.bpmForms.submitListPage);
  const limit = useSelector((state) => state.bpmForms.limit);
  const totalForms = useSelector((state) => state.bpmForms.totalForms);
  const formsort = useSelector((state) => state.bpmForms.sort);
  const searchText = useSelector((state) => state.bpmForms.searchText);
  
  // Constants
  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  const pageOptions = [
    { text: "5", value: 5 },
    { text: "25", value: 25 },
    { text: "50", value: 50 },
    { text: "100", value: 100 },
    { text: "All", value: totalForms },
  ];

  // Utility functions
  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleRow(index);
    }
  };

  // Event handlers
 const handleSort = (key) => {
    const newSortOrder = formsort[key].sortOrder === "asc" ? "desc" : "asc";
  
    // Reset all other columns to default (ascending) except the active one
    const updatedSort = Object.keys(formsort).reduce((acc, columnKey) => {
      acc[columnKey] = { sortOrder: columnKey === key ? newSortOrder : "asc" };
      return acc;
    }, {});
  
    dispatch(setBpmFormSort({
      ...updatedSort,
      activeKey: key,
    }));
  };

  const submitNewForm = (formId) => {
    dispatch(push(`${redirectUrl}form/${formId}`));
  };

  const handlePageChange = (page) => {
    dispatch(setBPMSubmitListPage(page));
  };

  const onSizePerPageChange = (newLimit) => {
    dispatch(setBPMFormLimit(newLimit));
    dispatch(setBPMSubmitListPage(1));
  };

  const toggleRow = (index) => {
    setExpandedRowIndex(prevIndex => prevIndex === index ? null : index);
  };

  // UI Components
  const noDataFound = () => {
    return (
      <tbody>
        <tr>
          <td colSpan="3">
            <div className="d-flex align-items-center justify-content-center clientForm-table-col flex-column w-100">
              <h3>{t("No forms found")}</h3>
              <p>{t("Please change the selected filters to view Forms")}</p>
            </div>
          </td>
        </tr>
      </tbody>
    );
  };

  // Effects
  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  useEffect(() => {
    if (!search?.trim()) {
      dispatch(setBpmFormSearch(""));
    }
  }, [search]);

  return (

    <LoadingOverlay
      active={searchFormLoading}
      spinner
      text={t("Loading...")}
    >
      <div className="min-height-400">
        <div className="custom-tables-wrapper">
        <table className="table custom-tables table-responsive-sm" data-testid="client-table">
            <thead className="table-header">
              <tr>
                <th className="w-20" data-testid="form-name-header">
                  <SortableHeader
                    columnKey="formName"
                    title="Form Name"
                    currentSort={formsort}
                    handleSort={handleSort}
                    className="gap-2"
                  />
                </th>
                <th className="w-30" scope="col" data-testid="description-header">{t("Description")}</th>

                <th className="w-13" scope="col" data-testid="submission-count-header">
                   <SortableHeader
                    columnKey="submissionCount"
                    title="Submissions"
                    currentSort={formsort}
                    handleSort={handleSort}
                    className="gap-2" />
                </th>

                <th className="w-13" scope="col" data-testid="latest-submission-header">
                  <SortableHeader
                    columnKey="modified"
                    title={t("Latest Submission")}
                    currentSort={formsort}
                    handleSort={handleSort}
                    className="gap-2" />
                </th>
                <th className="w-12" colSpan="4" aria-label="Select a Form"></th>
              </tr>
            </thead>
            {formData?.length ? (
              <tbody>
                {formData.map((e, index) => {
                  const isExpanded = expandedRowIndex === index;
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="w-20">
                          <span
                            data-testid={`form-title-${e._id}`}
                            className="mt-2 text-container"
                          >
                            {e.title}
                          </span>
                        </td>
                        <td className="w-30">
                          <span
                            data-testid="description-cell"
                            className={` cursor-pointer ${isExpanded ? "text-container-expand" : "text-container"}`}
                            role="button"
                            tabIndex="0"
                            aria-expanded={isExpanded} // Adds accessibility
                            onClick={() => toggleRow(index)}
                            onKeyDown={(e) => handleKeyPress(e, index)}
                          >
                            {stripHtml(e.description ? e.description : "")}
                          </span>
                        </td>
                        <td
                          data-testid={`Submissions-count-${e._id}`} className="w-13">
                          {e.submissionsCount}
                        </td>
                        <td
                          data-testid={`latest-submission-${e._id}`} className="w-13">
                          {formatDate(e.modified)}
                        </td>

                        <td className=" w-12 ">
                          <div className="d-flex justify-content-end">
                            <button
                              data-testid={`form-submit-button-${e._id}`}
                              className="btn btn-secondary btn-table"
                              onClick={() => submitNewForm(e._id)}
                            >
                              <Translation>{(t) => t("Select")}</Translation>
                            </button>
                          </div>
                        </td>
                      </tr>

                    </React.Fragment>
                  );
                })}
                {formData.length ? (
                  <TableFooter
                    limit={limit}
                    activePage={pageNo}
                    totalCount={totalForms}
                    handlePageChange={handlePageChange}
                    onLimitChange={onSizePerPageChange}
                    pageOptions={pageOptions}
                  />
                ) : (
                  <td colSpan={3}></td>
                )}
              </tbody>
            ) : !searchFormLoading ? (
              noDataFound()
            ) : (
              null
            )}
          </table>
        </div>
      </div>
    </LoadingOverlay>

  );
}

export default ClientTable;
