import { COLLECTION_ROLE, SUB_TYPE, type Collection } from "@/media/collection";
import type { User } from "@ente/shared/user/types";

export const ARCHIVE_SECTION = -1;
export const TRASH_SECTION = -2;
export const DUMMY_UNCATEGORIZED_COLLECTION = -3;
export const HIDDEN_ITEMS_SECTION = -4;
export const ALL_SECTION = 0;

export const getDefaultHiddenCollectionIDs = (collections: Collection[]) => {
    return new Set<number>(
        collections
            .filter(isDefaultHiddenCollection)
            .map((collection) => collection.id),
    );
};

export const isDefaultHiddenCollection = (collection: Collection) =>
    // TODO: Need to audit the types
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    collection.magicMetadata?.data.subType === SUB_TYPE.DEFAULT_HIDDEN;

export function isIncomingShare(collection: Collection, user: User) {
    return collection.owner.id !== user.id;
}

export function isIncomingCollabShare(collection: Collection, user: User) {
    // TODO: Need to audit the types
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const sharee = collection.sharees?.find((sharee) => sharee.id === user.id);
    return sharee?.role === COLLECTION_ROLE.COLLABORATOR;
}
