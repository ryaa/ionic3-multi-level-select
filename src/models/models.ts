export class Identity {
    public id?: number;
    public creationTime?: string;
    public lastModificationTime?: string;
}

export class NamedIdentity {
    public id?: number;
    public name?: string;
}

export enum SortOrder {
    ById = 0,
    Alphabetical = 1
}

export interface LookUpItemRaw extends NamedIdentity, Identity {
    parentId?: number;
    color?: string;
    icon?: string;
    longitude?: number;
    latitude?: number;
    shortcut?: string;
    level?: number;
    teams?: NamedIdentity[];
}

export interface LookUpItem extends NamedIdentity {
    parentId: number;
    children: LookUpItem[];
}

export interface SlideItem extends NamedIdentity {
    parentId: number;
    nextSlideIndex: number;
    selected?: boolean;
    slide: Slide;
    lookUpItem: LookUpItem;
}

export interface Slide {
    parentSlideItem: SlideItem;
    parentSlide: Slide;
    slideIndex: number;
    items: SlideItem[];
}
