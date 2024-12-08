import { Component, Input, OnInit } from '@angular/core';
import { VariableForm } from '../endpoint-form';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { RxDocumentData } from 'rxdb';
import { DatabaseService } from 'src/app/database/database.service';
import { GlobalVariablesDialogComponent } from '../../global-variables-dialog/global-variables-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalsListItem } from 'src/app/database/global-variables';
import { SimpleTableConfig } from 'src/app/utils/simple-table/simple-table-config';
import { variableTableConfig } from './variables-simple-config';

@Component({
	selector: 'variables',
	templateUrl: './variables.component.html',
	styleUrl: './variables.component.scss'
})
export class VariablesComponent implements OnInit {
	@Input() public formGroup!: FormGroup<VariableForm>;
	public dataSource!: MatTableDataSource<RxDocumentData<GlobalsListItem>>;
	public config: SimpleTableConfig<GlobalsListItem>;

	constructor(private readonly db: DatabaseService, private readonly dialog: MatDialog) {
		this.config = variableTableConfig();
	}

	public async ngOnInit(): Promise<void> {
		await this.getGlobalsFromDb();
	}

	public applyFilter(event: Event): void {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
		this.dataSource.paginator?.firstPage();
	}

	public openGlobalVariables(): void {
		this.dialog.open(
			GlobalVariablesDialogComponent, { width: '50%' }
		).afterClosed().subscribe(() => this.getGlobalsFromDb());
	}

	private async getGlobalsFromDb(): Promise<void> {
		const rxDocs = await this.db.getGlobals();
		this.dataSource = new MatTableDataSource(rxDocs);
	}
}
