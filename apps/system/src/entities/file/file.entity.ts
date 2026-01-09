import { Entity } from 'typeorm';
import { DatabaseEntity } from '@app/common';

@Entity('file')
export class FileEntity extends DatabaseEntity {}
