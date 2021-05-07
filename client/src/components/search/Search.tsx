/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Icon, Autocomplete } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useLazyQuery } from "@apollo/client";
import { OptionDescriptor } from "@shopify/polaris/dist/types/latest/src/components/OptionList";

import { useDispatch } from "react-redux";
import IBaseMovie from "../../models/interfaces/BaseMovie";
import { MOVIE_SEARCH } from "../../graphQL/queries";
import ReduxActions from "../../models/classes/ReduxActions";
import GenericOutputs from "../../models/classes/GenericOutputs";
import "./Search.css";

const genericOutputs = new GenericOutputs();
const reduxActions = new ReduxActions();

const Search = (): JSX.Element => {
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<OptionDescriptor[]>(
    genericOutputs.errorOptions,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [baseMovieSearch, { data }] = useLazyQuery(MOVIE_SEARCH, {
    variables: { title: inputValue },
  });

  useEffect(() => {
    baseMovieSearch();
  }, [inputValue, baseMovieSearch]);

  // detector for when graphql query completes
  useEffect(() => {
    let optionsArray: OptionDescriptor[];

    // check if data exists
    if (data?.baseMovieSearch) {
      // remove all options that are not movies
      const movieOptions: IBaseMovie[] = data.baseMovieSearch.filter(
        (dataIndex: IBaseMovie) => {
          return dataIndex.Type === "movie";
        },
      );

      if (movieOptions) {
        // null check
        // set redux state (for use later) and autocomplete options to query results
        dispatch(reduxActions.setMovieList(movieOptions));
        optionsArray = movieOptions.map((movieOption) => ({
          value: movieOption.imdbID,
          label: `${movieOption.Title} (${movieOption.Year})`,
        }));
      } else {
        // error handling
        dispatch(reduxActions.setMovieList(genericOutputs.errorMovieList));
        optionsArray = genericOutputs.errorOptions;
      }
    } else {
      // error handling
      optionsArray = genericOutputs.errorOptions;
      if (data) {
        dispatch(reduxActions.setMovieList(genericOutputs.errorMovieList));
      }
    }
    setOptions(optionsArray); // set autocomplete options
    dispatch(reduxActions.showMovieList());
    return () => setIsLoading(false);
  }, [data, dispatch]);

  // callback for when user tyes into the search bar
  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);
      if (value === "") {
        setIsLoading(true);
        setOptions(genericOutputs.initOptions);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        baseMovieSearch();
      }
    },
    [baseMovieSearch],
  );

  // callback for if user selects an autocomplete option
  const updateSelection = useCallback(
    (selected) => {
      const selectedValue: OptionDescriptor[] = selected.map(
        (selectedItem: string) => {
          const matchedOption = options.find((option) => option.value.match(selectedItem));
          return matchedOption;
        },
      );
      const removeAfter = (selectedValue[0].label as string).indexOf("(");
      const returnInput = (selectedValue[0].label as string)
        .substring(0, removeAfter)
        .trim();
      setSelectedOptions(selected);
      if (returnInput && returnInput !== "") {
        setInputValue(returnInput);
      }
    },
    [options],
  );

  // keyboard support for ease of use with the autocomplete searcher
  const keypressHandler = useCallback(
    (e: any): void => {
      if (e.code === "Enter") {
        setOptions([]);
      }
    },
    [],
  );

  // Template
  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label=""
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
    />
  );
  return (
    <div
      onKeyPress={keypressHandler}
      style={{ height: "10vh" }}
    >
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
        loading={isLoading}
      />
    </div>
  );
};

export default Search;