'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styles from './risk-reports-uploader.module.scss';
import { calculateFileSize, DataGrid } from '../data-grid';
import { ColDef } from 'ag-grid-community';
import { File, fileManagerService } from '@/services/file-manager';
import { FileUploadWizard } from './file-upload-wizard';
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { themePlugin } from "@react-pdf-viewer/theme";
import { useScrollTo } from '@/lib/hooks';

const EMPTY = new Uint8Array(0);

export function RiskReportsUploader() {
  const { scrollTargetRef, scrollToTarget } = useScrollTo<HTMLDivElement>();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>();
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const columnDefs = useMemo<ColDef[]>(() => getColumnDef(), []);

  function loadUploadedFiles() {
    setFilesLoading(true);

    fileManagerService
      .getUploadedFiles()
      .then(files => {
        setUploadedFiles(files);
        setFilesLoading(false);
      });
  }

  useEffect(() => {
    loadUploadedFiles();
  }, []);

  function handleRowSelection(event: any) {
    setSelectedFile(
      fileManagerService.getUploadedFileUrl(event.data!.filename)
    );

    scrollToTarget();
  }

  async function deleteFile(file:File ) {
    await fileManagerService.deleteFile(file.filename!);
    loadUploadedFiles();
  }

  function getColumnDef(): ColDef[] {
    return [
      {
        field: 'filename',
        headerName: 'File Name',
        width: 300,
        autoHeight: true,
        wrapText: true
      },
      {
        field: 'size',
        headerName: 'Size',
        width: 120,
        autoHeight: true,
        valueFormatter: params => calculateFileSize(params.value),

      },
      {
        field: 'upload_date',
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
        cellRenderer: (params: any) => (<div className='gap-5 flex fs-14 '>
          <i className='fa-regular fa-envelope cursor-pointer'></i>
          <i className='fa-regular fa-circle-down cursor-pointer'></i>
          <i className='fa-regular fa-share-from-square cursor-pointer'></i>
          <i className='fa-regular fa-trash-can cursor-pointer' onClick={() => deleteFile(params.data)}></i>
        </div>)
      }
    ];
  }

  return (
    <div className={styles['risk-reports-container']}>
      <div className={styles['risk-reports-documents']}>
        <div className={styles['risk-reports-uploader']}>
          <FileUploadWizard onUploadSuccess={() => loadUploadedFiles()} />
        </div>

        <div className={styles['reports-grid']}>
          <div>My Documents</div>
          <DataGrid
            isSummaryGrid={true}
            rowData={uploadedFiles}
            loading={filesLoading}
            columnDefs={columnDefs}
            onRowDoubleClicked={handleRowSelection}
          >
          </DataGrid>
        </div>
      </div>

      <div className={styles['risk-reports-preview-container']}>
        <div className={styles['risk-reports-preview']} style={{ display: selectedFile ? 'flex' : 'none' }} ref={scrollTargetRef}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={selectedFile ? selectedFile : EMPTY}
              defaultScale={1.25}
              plugins={[defaultLayoutPlugin(), themePlugin()]}
              theme={'dark'}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}
