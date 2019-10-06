import {
  GetRepository,
  IFireOrmQueryLine,
  IFirestoreVal,
  IOrderByParams
} from "fireorm";
import { Arg, ClassType, Mutation, Query, Resolver } from "type-graphql";
import { firestore } from "firebase-admin";

/**
 * Create basic CRUD functionality with resolvers
 * @param suffix The name of the model
 * @param returnType The model types
 * @param model The actual model class
 * @param inputType The input types
 */
function createResolver<T extends ClassType>(
  suffix: string,
  returnType: T,
  model: any,
  inputType: any
) {
  @Resolver(of => returnType)
  class BaseResolver {
    @Query(returns => returnType, {
      nullable: true,
      description: `Get a specific ${suffix.toLowerCase()} document from the collection.`
    })
    async [`${suffix.toLowerCase()}`](@Arg("id") id: string): Promise<T> {
      return await model.find(id);
    }

    @Query(returns => [returnType], {
      nullable: true,
      description: `Get a list of ${suffix.toLowerCase()} documents from the collection.`
    })
    async [`${suffix.toLowerCase()}s`](): Promise<any[]> {
      return (await model
        .ref()
        .limit(15)
        .get()).docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
    }

    @Mutation(returns => returnType)
    async [`add${suffix}`](
      @Arg("data", () => inputType, {
        description: `Add a new document to the ${suffix.toLowerCase()} collection.`
      })
      data: any
    ) {
      return await model.create(data);
    }

    @Mutation(returns => returnType)
    async [`delete${suffix}`](
      @Arg("id", () => String, {
        description: `The ID of the document being deleted in the ${suffix.toLowerCase()} collection`
      })
      id: string
    ) {
      const modelBefore = await model.find(id);
      await model.delete(id);

      return modelBefore;
    }

    @Mutation(returns => returnType)
    async [`edit${suffix}`](
      @Arg("id", () => String, {
        description: `The ID of the document in the ${suffix.toLowerCase()} collection`
      })
      id: string,
      @Arg("data", () => inputType, {
        description: `Update a document in the ${suffix.toLowerCase()} collection.`
      })
      data: any
    ) {
      return await model.update({ id, ...data });
    }
  }

  return BaseResolver;
}

export class FireEnjinGraphModel {
  Resolver: any;

  constructor(
    protected options: {
      collection: any;
      inputType?: any;
    }
  ) {
    this.Resolver = createResolver(
      options.collection.name,
      options.collection,
      this,
      options.inputType
    );
  }

  /**
   * Create a new document and add it to the collection
   * @param modelObject The data to add to the document
   */
  create(modelObject) {
    return this.repo().create(modelObject);
  }

  /**
   * Delete a document from a collection
   * @param id The id of the document to delete
   */
  delete(id) {
    return this.repo().delete(id);
  }

  /**
   * Execute a query on a collection
   * @param queries A list of queries
   * @param limitVal The limit of records to return
   * @param orderByObj The order of the records
   */
  execute(
    queries: Array<IFireOrmQueryLine>,
    limitVal?: number,
    orderByObj?: IOrderByParams
  ) {
    return this.repo().execute(queries, limitVal, orderByObj);
  }

  /**
   * Get a specific document's data
   * @param id The id of the document
   */
  async find(id: string) {
    const data = await this.repo().findById(id);
    data.id = id;

    return data;
  }

  /**
   * Get the Firestore reference to the collection
   */
  ref(): firestore.CollectionReference {
    return (this.repo() as any).firestoreColRef;
  }

  /**
   * Get the FireORM repo reference for the collection
   * @see https://fireorm.js.org/#/classes/basefirestorerepository
   */
  repo() {
    return GetRepository(this.options.collection);
  }

  /**
   * Run a transaction on the collection
   * @param executor The transaction executor function
   */
  runTransaction(executor) {
    return this.repo().runTransaction(executor);
  }

  /**
   * Limit the number of records returned
   * @param limitTo The limit of data to return
   */
  limit(limitTo: number) {
    return this.repo().limit(limitTo);
  }

  /**
   * Order a list of documents by a specific property in ascending order
   * @param prop The property to order ascending by
   */
  orderByAscending(prop) {
    return this.repo().orderByAscending(prop);
  }

  /**
   * Order a list of documents by a specific property in descending order
   * @param prop The property to order descending by
   */
  orderByDescending(prop) {
    return this.repo().orderByDescending(prop);
  }

  /**
   * Update the data on a document from the collection
   * @param data The data to update on the document
   */
  update(data: any) {
    return this.repo().update(data);
  }

  /**
   * Get a list of documents where property equals value
   * @param prop The property to check eqaulity of
   * @param value The value to be equal to
   */
  whereEqualTo(prop, value: IFirestoreVal) {
    return this.repo().whereEqualTo(prop, value);
  }

  /**
   * Get a list of documents where property greater than value
   * @param prop The property to check eqaulity of
   * @param value The value to be greater than to
   */
  whereGreaterThan(prop, value: IFirestoreVal) {
    return this.repo().whereGreaterThan(prop, value);
  }

  /**
   * Get a list of documents where property less than value
   * @param prop The property to check eqaulity of
   * @param value The value to be less than to
   */
  whereLessThan(prop, value: IFirestoreVal) {
    return this.repo().whereLessThan(prop, value);
  }

  /**
   * Get a list of documents where property less than or equal to value
   * @param prop The property to check eqaulity of
   * @param value The value to be less than or equal to
   */
  whereLessOrEqualThan(prop, value: IFirestoreVal) {
    return this.repo().whereLessOrEqualThan(prop, value);
  }

  /**
   * Get a list of documents where property is equal to one of a list of values
   * @param prop The property to search for values
   * @param value The values to check for
   */
  whereArrayContains(prop, value: IFirestoreVal) {
    return this.repo().whereArrayContains(prop, value);
  }
}
