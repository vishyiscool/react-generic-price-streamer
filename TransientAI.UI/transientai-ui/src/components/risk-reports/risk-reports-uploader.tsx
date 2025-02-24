'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import styles from './risk-reports-uploader.module.scss';
import { DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';
import { RiskReport } from '@/services/reports-data';
import {getUploadedReports} from '@/services/reports-data/risk-reports-data';
import { FileUploadWizard } from './file-upload-wizard';
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";
import {themePlugin} from "@react-pdf-viewer/theme";
// import {useScrollTo} from "@/lib/hooks";

export function RiskReportsUploader() {
  const [riskReports, setRiskReports] = useState<RiskReport[]>();
  const [fileName, setFileName] = useState('');
  // const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>(-200);
  const [selectedReport, setSelectedReport] = useState<RiskReport>({});
  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);

  useEffect(() => loadRiskReports(), []);

  function loadRiskReports() {
    const loadDataAsync = async () => {
      const reports = await getUploadedReports();
      setRiskReports(reports);
      return reports;
    }

    loadDataAsync();
  }

  function handleRowSelection(event: any) {
    setSelectedReport(event.data!);
  }

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'First Name,Age\n'; // CSV Headers
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'portfolio',
        headerName: 'Report Name',
        width: 150,
        autoHeight: true,
        wrapText: true
      },
      {
        field: 'uploadedBy',
        headerName: 'Uploaded By',
        width: 130,
        autoHeight: true,
        wrapText: true
      },
      {
        field: 'uploadStatus',
        headerName: 'Upload Status',
        width: 150,
        autoHeight: true,
        wrapText: true
      },
      {
        field: 'date',
        headerName: 'Date',
        width: 120,
        sort: 'desc',
        cellClass: 'date-cell', // Optional: Apply date styling
        autoHeight: true
      },
      {
        field: '',
        headerName: '',
        width: 200,
        autoHeight: true,
        cellRenderer:(params:any) => (<div className='gap-5 flex fs-14 '>
          <i className='fa-regular fa-envelope cursor-pointer'></i>
          <i className='fa-regular fa-circle-down cursor-pointer'></i>
          <i className='fa-regular fa-share-from-square cursor-pointer'></i>
          <i className='fa-regular fa-trash-can cursor-pointer'></i>
        </div>)
      },
      // {
      //   headerName: '',
      //   width: 100,
      //   floatingFilter: false,
      //   cellRenderer: IconCellRenderer,
      //   cellRendererParams: {
      //     className: 'fa-solid fa-eye',
      //     onClickHandler: () => alert('hey') 
      //   }
      // }
    ];
  }

  return (
      <div className={styles['risk-reports-container']}>
        <div className={styles['risk-reports-documents']}>
          <div className={styles['risk-reports-uploader']}>
            <FileUploadWizard onUploadSuccess={newFile => setRiskReports([...riskReports!, newFile])}></FileUploadWizard>
          </div>
          <div className={styles['reports-grid']}>
            <div>My Documents</div>
            <DataGrid
                isSummaryGrid={true}
                rowData={riskReports}
                columnDefs={columnDefs}
                onRowClicked={handleRowSelection}
                onRowDoubleClicked={handleRowSelection}
            >
            </DataGrid>
          </div>
        </div>
        <div
            className={styles['risk-reports-preview']}
            style={{ display: selectedReport.pdfSource ? 'flex' : 'none' }}
            >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
                fileUrl={selectedReport.pdfSource ? selectedReport.pdfSource : '/pdfs/RiskDecomp.pdf'}
                defaultScale={1.25}
                plugins={[defaultLayoutPlugin(), themePlugin()]}
                theme={'dark'}
            />
          </Worker>
        </div>
      </div>
  );
}
